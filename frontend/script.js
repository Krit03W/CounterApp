class CounterApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maleCount: 0,
            femaleCount: 0,
            logs: [],
            startDate: "",
            endDate: ""
        };
    }

    increaseMale = () => this.setState({ maleCount: this.state.maleCount + 1 });
    decreaseMale = () => this.setState({ maleCount: Math.max(0, this.state.maleCount - 1) });
    increaseFemale = () => this.setState({ femaleCount: this.state.femaleCount + 1 });
    decreaseFemale = () => this.setState({ femaleCount: Math.max(0, this.state.femaleCount - 1) });

    save = async () => {
        const { maleCount, femaleCount } = this.state;
        await fetch("http://localhost:5000/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ male: maleCount, female: femaleCount })
        });
        this.setState({ maleCount: 0, femaleCount: 0 });
    };

    fetchLogs = async () => {
        const { startDate, endDate } = this.state;
        const response = await fetch(`http://localhost:5000/logs?start=${startDate}&end=${endDate}`);
        const data = await response.json();
        this.setState({ logs: data });
    };

    render() {
        return (
            <div className="container">
                <h1>Counter</h1>

                <div className="counter-box">
                    <div className="counter">
                        <h2 style={{ color: "blue" }}>Man</h2>
                        <img src="man.png" alt="Man" />
                        <div className="counter-display">{this.state.maleCount}</div>
                        <button className="btn up" onClick={this.increaseMale}>UP</button>
                        <button className="btn down" onClick={this.decreaseMale}>DOWN</button>
                    </div>

                    <div className="counter">
                        <h2 style={{ color: "pink" }}>Woman</h2>
                        <img src="woman.png" alt="Woman" />
                        <div className="counter-display">{this.state.femaleCount}</div>
                        <button className="btn up" onClick={this.increaseFemale}>UP</button>
                        <button className="btn down" onClick={this.decreaseFemale}>DOWN</button>
                    </div>
                </div>

                <div className="buttons">
                    <button className="btn save" onClick={this.save}>Save</button>
                    <button className="btn reset" onClick={() => this.setState({ maleCount: 0, femaleCount: 0 })}>Reset</button>
                </div>

                <h2>เลือกช่วงเวลา</h2>
                <input type="datetime-local" onChange={e => this.setState({ startDate: e.target.value })} />
                <input type="datetime-local" onChange={e => this.setState({ endDate: e.target.value })} />
                <button className="btn" onClick={this.fetchLogs}>ดึงข้อมูล</button>

                <h2>บันทึกข้อมูล</h2>
                <ul id="log">
                    {this.state.logs.map((log, index) => (
                        <li key={index}>{`[ ${new Date(log.timestamp).toLocaleString()} ] : M:${log.male_count}, F:${log.female_count}, T:${log.total_count}`}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<CounterApp />, document.getElementById("root"));
