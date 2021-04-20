import './App.css';
import React, { Component } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from './components/chart/Chart';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cryptoCurrency: "BTC",
      countryCurrency: "BRL",
      investedValue: 0,
      limit: 365,
      finalDate: new Date().getTime(),
      grossYield: 0,
      netYield: 0,
      profitability: [],
      coinDate: [],
      percent: [],
      currencyData: {}
    }
  }
  componentDidMount(){
    this.handleApiCall()
  }

  handleApiCall() {
    this.setState({
      coinDate: []
    })
    let coinCloseValueAtDate = []

    var investedValueFirst = parseInt(this.state.investedValue)
    this.setState({
      profitability: [investedValueFirst]
    })

    fetch("https://min-api.cryptocompare.com/data/v2/histoday?fsym=" + this.state.cryptoCurrency + "&tsym=" + this.state.countryCurrency
      + "&limit=" + this.state.limit + "&toTs=" + this.state.finalDate)
      .then(res => res.json())
      .then(
        (result) => {
          var count = 0
          for (const dataObj of result.Data.Data) {
            var convertedTimestamp = new Date(dataObj.time * 1000)
            var convertedDate = (convertedTimestamp.getMonth() + 1) + "/" + convertedTimestamp.getFullYear()
            this.setState({
              coinDate: [...this.state.coinDate, convertedDate]
            })
            
            coinCloseValueAtDate.push(parseInt(dataObj.close))

            if (count > 0) {
              var percentValue = (1 - (coinCloseValueAtDate[count - 1] / coinCloseValueAtDate[count]))
              this.setState({
                percent: [...this.state.percent, percentValue]
              })
              var parseProfitability = parseInt(this.state.profitability[count - 1] * this.state.percent[count - 1] + this.state.profitability[count - 1])
              this.setState({
                profitability: [...this.state.profitability, parseProfitability]
              })
            }
            count += 1
          }

          var final = this.state.profitability.length - 1
          var finalValue = this.state.profitability[final]
          var netYield = finalValue - this.state.profitability[0]

          this.setState({
            currencyData: {
              labels: this.state.coinDate,
              datasets: [
                {
                  label: this.state.cryptoCurrency,
                  data: coinCloseValueAtDate,
                  fill: false,
                  borderColor: '#FFCC00',
                  pointBorderWidth: 1,
                  borderWidth: 1,
                  pointStyle: 'dash',
                  tension: 0.4
                },
                {
                  label: this.state.countryCurrency,
                  data: this.state.profitability,
                  fill: false,
                  borderColor: '#000',
                  pointBorderWidth: 1,
                  borderWidth: 1,
                  pointStyle: 'dash',
                }
              ]
            },
            grossYield: finalValue,
            netYield: netYield,
          })
        }
      )
      .catch(error => {
        console.log(error)
      })

      console.log(this.state.coinDate)
  }


  handleInformations(cryptoCurrency, countryCurrency, investedValue, initialDate, finalDate, finalValue, netYield, percentual) {
    var initialDateSplited = initialDate.split("-")
    var initialDateTimestamp = new Date(initialDateSplited[0], initialDateSplited[1] - 1, initialDateSplited[2])

    var finalDateSplited = finalDate.split("-")
    var finalDateTimestamp = new Date(finalDateSplited[0], finalDateSplited[1] - 1, finalDateSplited[2]).getTime()
    var diferencePerDay = (finalDateTimestamp - initialDateTimestamp.getTime()) / (1000 * 3600 * 24)
    finalDateTimestamp = finalDateTimestamp / 1000
    console.log("ultima data selecioanda: " + finalDateTimestamp)

    this.setState({
      cryptoCurrency: cryptoCurrency,
      countryCurrency: countryCurrency,
      investedValue: investedValue,
      limit: diferencePerDay,
      finalDate: finalDateTimestamp,

    },
      () => {
        this.handleApiCall()
      })

  }

  handleInputChange() {
    var verify = this.verifyInput()
    if (verify) {

      let cryptocurrency = document.getElementById("formCryptoCurrency").value
      let countrycurrency = document.getElementById("formCountryCurrency").value
      let investedValue = document.getElementById("formInvestValue").value
      let initialDate = document.getElementById("formInitialDate").value
      let finalDate = document.getElementById("formFinalDate").value

      var final = this.state.profitability.length - 1
      var finalValue = this.state.profitability[final]
      var netYield = finalValue - this.state.profitability[0]
      var percentual = finalValue / this.state.profitability[0] * 100
      this.handleInformations(cryptocurrency, countrycurrency, investedValue, initialDate, finalDate, finalValue, netYield, percentual)
    }
  }

  verifyInput() {
    let investedValue = document.getElementById("formInvestValue").value
    let initialDate = document.getElementById("formInitialDate").value
    let finalDate = document.getElementById("formFinalDate").value
    if (investedValue && initialDate && finalDate !== "")
      return true
    return false
  }


  render() {
    const { grossYield, netYield, currencyData } = this.state

    return (
      <Container fluid>
        <Row>
          <Col>
            <h1>Calcule o rendimento do seu investimento em Cryptomoedas {this.cryptoCurrency} </h1>
          </Col>
        </Row>

        <Row>
          <Col className="formInformations">
            {/*<InputInformations handleInformations={this.handleInformations.bind(this)} />*/}

            <Form>
              <Form.Group as={Row} controlId="formCryptoCurrency">
                <Form.Label column sm="4">Cryptomoeda</Form.Label>
                <Col>
                  <Form.Control as="select">
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>BNB</option>
                    <option>XRP</option>
                    <option>USDT</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formCountryCurrency">
                <Form.Label column sm="4">Moeda do país</Form.Label>

                <Col>
                  <Form.Control as="select" >
                    <option>BRL</option>
                    <option>USD</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formInvestValue">
                <Form.Label column sm="4">Valor investido</Form.Label>

                <Col>
                  <Form.Control type="text" placeholder="0.000" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formInitialDate">
                <Form.Label column sm="4">Data inicial</Form.Label>
                <Col>
                  <Form.Control type="date" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formFinalDate">
                <Form.Label column sm="4">Data do resgate</Form.Label>
                <Col>
                  <Form.Control type="date" />
                </Col>
              </Form.Group>

              <Button size="lg" block onClick={this.handleInputChange.bind(this)}>Calcular</Button>
            </Form>

          </Col>
          <Col >
            {  <Chart currencyData={currencyData}/>}
          </Col>
        </Row>
        <Row >
          <Col className="infoProfitability">
            <p className="info">Rendimento Bruto: {grossYield}</p>
            <p className="info">Rendimento Líquido: {netYield}</p>
          </Col>
        </Row>

      </Container>
    );
  }

}

export default App;
