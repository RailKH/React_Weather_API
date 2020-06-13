const PROXY = "https://cors-anywhere.herokuapp.com/";
const API = "3d8fe13e1075d9f1b93146ceb9559e2a";
const CITY_API = "http://api.travelpayouts.com/data/ru/cities.json";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            weatherData: "",
            cities: [],
            cityName: {
                name: "Казань",
                lat: 55.60844,
                lon: 49.29824,
            },
            valueOfInput: "",
            filterCity: [],
            idOfDay: 0,
        };
        this.addCities = this.addCities.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.selectCity = this.selectCity.bind(this);
        this.selectWeather = this.selectWeather.bind(this);
        this.dateBuilder = this.dateBuilder.bind(this);
    }

    componentDidMount() {
        fetch(PROXY + CITY_API)
            .then((json) => json.json())
            .then((json) => {
                console.log("получил города");
                let data = [];
                data = json.filter((item) => item.name);
                data.sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                });
                this.state.cities = data;
                console.log(this.state);
            });

        this.getWeather(this.state.cityName.lat, this.state.cityName.lon);
        console.log("sss");
    }
    getWeather = async (lat, lon) => {
        const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}&units=metric&lang=ru`;
        await fetch(PROXY + URL)
            .then((res) => res.json())
            .then((json) => {
                console.log("начало сортировки погоды");

                let count = 0;
                const weather = json.list.filter((item, ind) => {
                    if (ind == 0) {
                        this.state.date_now = new Date(item.dt_txt);
                    }
                    if (count <= 2) {
                        if (ind == 0 || ind > 3) {
                            let date = new Date(item.dt_txt);

                            if (ind == 0 || date.getHours() === 12) {
                                count++;
                                return item;
                            }
                        }
                    }
                });
                console.log("устанавливаю в стейт погоду");
                this.setState({
                    weatherData: weather,
                });
            });
    };

    selectWeather(id) {
        this.setState({
            idOfDay: id,
        });
    }
    selectCity(id, e) {
        const target = e.target;
        this.state.cityName = {
            name: e.target.textContent,
            lat: this.state.filterCity[id].coordinates.lat,
            lon: this.state.filterCity[id].coordinates.lon,
        };

        this.state.filterCity = [];
        console.log("отправка значений для получения погоды");

        this.getWeather(this.state.cityName.lat, this.state.cityName.lon);

        this.setState({
            valueOfInput: "",
            idOfDay: 0,
        });
    }
    dateBuilder = (d) => {
        let months = [
            "Января",
            "Февраля",
            "Марта",
            "Апреля",
            "Мая",
            "Июня",
            "Июля",
            "Августа",
            "Сентября",
            "Ноября",
            "Декабря",
        ];
        let day = d.getDate();
        let month = months[d.getMonth()];
        return `${day} ${month}`;
    };
    addCities(e) {
        this.state.filterCity = [];
        if (e.target.value !== "") {
            this.state.filterCity = this.state.cities.filter((item) => {
                const fixItem = item.name.toLowerCase();
                return fixItem.startsWith(e.target.value.toLowerCase());
            });
        }
        this.setState({
            valueOfInput: e.target.value,
        });
    }
    render() {
        const list = this.state.filterCity.map((item, id) => {
            return (
                <li
                    onClick={(e) => this.selectCity(id, e)}
                    key={id}
                    className="dropdown"
                >
                    {item.name}
                </li>
            );
        });
        return (
            <>
                <div className="search-box">
                    <input
                        type="text"
                        onChange={this.addCities}
                        value={this.state.valueOfInput}
                        className="search-bar"
                        placeholder="Search..."
                    />
                    <ul className="dropdown-list">{list}</ul>
                </div>
                {/* <MainWeather
                    weather={this.state.weatherData[this.state.idOfDay]}
                    cityName={this.state.cityName.name}
                    dateBuilder={this.dateBuilder}
                />
                <SelectWeather
                    weather={this.state.weatherData}
                    select_Weather={this.selectWeather}
                    dateBuilder={this.dateBuilder}
                    idOfDay={this.state.idOfDay}
                /> */}
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
