import React, { useState, useEffect, useRef } from "react"
import logo from "./logo.svg"
import "./App.css"
import { name } from "./api/imdb"
import { MDBInput, MDBContainer, MDBCol } from "mdbreact"
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"

import Grid from "@react-css/grid"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useImageColor from "use-image-color"
import Palette from "react-palette"
import Vibrant from "node-vibrant"

import { Wheel } from "react-custom-roulette"

class Movie {
  title: string
  rating: number
  description: string
  poster: string | null

  constructor(
    title: string,
    rating: number,
    description: string,
    poster: string | null
  ) {
    this.title = title
    this.rating = rating
    this.description = description
    this.poster = poster
  }
}

// const SearchBar = ({keyword,setKeyword}) => {
//   const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
//   return (
//     <input
//      style={BarStyling}
//      key="random1"
//      value={keyword}
//      placeholder={"search country"}
//      onChange={(e) => setKeyword(e.target.value)}
//     />
//   );
// }
const SearchPage = () => {
  return <MDBInput hint="Search" type="text" containerClass="mt-0" size="lg" />
}
interface spinItemStyle {
  backgroundColor: string
  textColor?: string
}
interface spinwheelData {
  option: string
  movieName?: string
  style?: spinItemStyle
}

function App() {
  const [input, setInput] = useState("")
  const [movieList, setMovieList] = useState<Array<Movie>>([])
  const [spinwheelData, setSpinwheelData] = useState<spinwheelData[]>([])
  const [colors, setColors] = useState([])
  const [prize, setPrize] = useState(spinwheelData.length)
  const [spinState, setSpinState] = useState(false)

  async function setDomColor(path: string, title: string) {
    console.log(spinwheelData)
    let v = new Vibrant(path)
    let color: string = ""
    let list = [...spinwheelData]
    console.log(spinwheelData)
    let index: number = 0
    index = list.findIndex((m) => m.movieName === title)

    console.log(index)
    await v.getPalette((err, palette) => {
      console.log("COLOR" + palette?.Vibrant?.getHex())
      color = palette?.Vibrant?.getHex() as string
    })

    // if (list.length !== 0) {
    //   list[index] = { ...list[index], style: { backgroundColor: "#000" } }
    // }
    // setSpinwheelData(list)

    return color
  }
  const fetchData = async (query: string) => {
    return await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=38c1d80950e65630e084362d93a2f134&language=en-US&query=${query}&page=1&include_adult=true`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results != undefined) {
          let tempMovieList: [Movie]
          let test = data.results.map(
            (i: {
              title: string
              vote_average: number
              overview: string
              poster_path: string
            }) => {
              // console.log('IIIII', i)
              let newMovie = new Movie(
                i.title,
                i.vote_average,
                i.overview,
                "https://www.themoviedb.org/t/p/w1280".concat(i.poster_path)
              )
              return newMovie
            }
          )
          setMovieList(test)
        }
      })
  }

  useEffect(() => {
    fetchData(input)
  }, [])

  function handleChange(e: any) {
    e.preventDefault()
    if (e.target.value != null) {
      setInput(e.target.value)
    }
    fetchData(input)
  }

  function setRandomInt() {
    let val = Math.floor(Math.random() * spinwheelData.length)
    setPrize(val)
  }

  const truncate = (input: string) =>
    input.length > 18 ? `${input.substring(0, 18)}...` : input

  return (
    <div className="app">
      <Grid autoFlowColumn>
        {/* <MDBContainer>
          <MDBCol md="6">
            <MDBInput
              hint="Search"
              type="text"
              containerClass="active-pink active-pink-2 mt-0 mb-10"
              value={input}
              onChange={handleChange}
            />
          </MDBCol>
        </MDBContainer> */}
        <div className="movieColumn">
          <input
            className="search__input"
            type="text"
            placeholder="Search"
            value={input}
            onChange={handleChange}
          />
          <Grid columnGap="15px" rowGap="15px" columns="150px 150px 150px">
            {movieList?.slice(0, 9).map(function (m, mid) {
              return (
                <div
                  className="movieList"
                  key={mid}
                  onClick={() => {
                    // let color = setDomColor(m.poster as string, m.title)
                    if (spinState === false) {
                      let tempArr = [...spinwheelData]
                      tempArr.push({
                        option: truncate(m.title),
                        movieName: m.title,
                        // style: {
                        //   backgroundColor: "#ffffff",
                        // },
                      })
                      setSpinwheelData(tempArr)
                      setDomColor(m.poster as string, m.title)
                    }
                  }}
                >
                  {/* <p>{m.poster}</p> */}
                  {/* <Palette src={m.poster as string}>
            {({ data, loading, error }) => (
              <div style={{ color: data.vibrant }}>
          Text with the vibrant color
              </div>
            )}
          </Palette> */}
                  {/* <ColorExtractor
           className="poster" src={m.poster ?? undefined}
            getColors={(c: any) => {
              let tempColors: any = [...colors]
              tempColors.push(c)
              setColors(tempColors)
            console.log(tempColors)
        
            }}
          /> */}
                  <img
                    className="poster"
                    src={
                      m.poster ??
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAAQlBMVEXo6Ojp6enn5+fd3d2ZmZmVlZW0tLSSkpLOzs6bm5u4uLji4uLu7u7W1ta7u7ufn5/FxcWnp6esrKzLy8vAwMDT09PG4IofAAAEXklEQVR4nO2diW6rMBBFbRMIawhZ/v9Xnxc2E0hF6bs20j2tGhqs5mSEZzxOlIomOSONSOQZSbS3OB/0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyHUzvuPcNRbzRH2Ww0/F3zcGdZbDAJyuNFf05+Uw4nZ6eHpHnjcv4i3VHs/9LCSMny8Zd4VO2mzRKpD1/1x7/qVXnaTFo0Me53IxGinhsFpndlZc9vKsPGWNtyPTNNaoS5bp7XadmBn/HXAg3pn2uFZG+RDH97qDZS2Te9uYJZe0jy896VyeeWeXq6NXObpPqvLmz5rp6OS+TUWbzNDe+9e1n0NhUj03u4JxuM9i/eiQgrlxVucwHt0VrPrJCLvtLK126QW620y3MfyZIq3qJ+ReJeVMWt0quu9V6am8b5kZqBITGqJwFtXkU5jMrS7TryFoXDH1nsaGIf3yPz6HqelvXHeU6WPz9tfg8/nZWzeadFqVuOt/HiPAwN7Czsvb9KU76S9LPP3pG7nZZopM7CKZF7qPGjNXvP8LRby1tvl71jy4Gbd6VPLmE+uVVR1Z7E+WemKx/WJze4ReIuteH809nGuB20YR+9ZDhwPZ+uTOry3yydP+xH/lekbSrH++f8uibxkrY9V+L7BXSdFdivLsnOdmDlcwZ3NzOEjfP7u6+X+vlh7H3jYP4r3L4go3um3cHtnw3u7eD+aSvMs9GH7rta5G+3ODszb4N6uzidmI1PWJtPltd3VtHubst/UlPbYJJHGDbwHzyc/13mvv4yuzhvBjzovnLfw685Y5w887H+K96yPH59EhP38Zp1fjXc83um7trU88/erfOz6O7cD61sk87K9v/M8v836NOFHvfd2A9+3Io48qHUN6aK/9DOK6y/TYWAc3iMr3mraH4y3zi+9hbePHE+dH65vfXnnZe/tXh2c7yOLYR+ifeX9RIjBeyWf+Ll72D/p84mMJZ98qfPL/e+Y8ven90pLfwLv1ZfnT+A9NfHCzyeReev1t33/gDF71v0fnj+IXY+79bf5PYr1d6kdHsnQxvQdzVq/U/j9zjuw9/M69pS7+ssqbH8pRPeL9xWY15UDv/9EJt11M8ZbXLPp/TaBvJWU+cYW1SavpnY9XEhvtbEj+BUV2Puzr1msTb6dDukdCHpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Y6E3FnpjoTcWemOhNxZ6Yzm19xlJRLP3v25GQfMPSUpFe5+/lOUAAAAASUVORK5CYII="
                    }
                  />
                </div>
              )
            })}
          </Grid>
        </div>
        {spinwheelData.length > 0 && (
          <div className="wheelColumn">
            <Wheel
              mustStartSpinning={spinState}
              prizeNumber={prize}
              data={spinwheelData}
              backgroundColors={["#ebd9d9", "#ffffff"]}
              textColors={["#000"]}
              fontSize={15}
              radiusLineWidth={2}
              radiusLineColor={"rgba(0, 0,0,0.2)"}
              outerBorderWidth={2}
              outerBorderColor={"rgba(0, 0,0,0.2)"}
              innerBorderWidth={1}
              onStopSpinning={() => {
                alert(spinwheelData[prize].movieName)
                setSpinState(false)
              }}
              perpendicularText={spinwheelData.length > 3 ? false : true}
            />
            <button
              type="button"
              className="fill"
              onClick={() => {
                setRandomInt()
                setSpinState(true)
              }}
            >
              Spin
            </button>
            {/* <Button
              size="lg"
              variant="outline-dark"
              onClick={() => {
                setRandomInt()
                setSpinState(true)
              }}
            >
              Spin
            </Button> */}
          </div>
        )}
      </Grid>
      {/* <CountryList countryList={countryList}/> */}
    </div>
  )
}

export default App
