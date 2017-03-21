/* ROOT Component of your App  */
import * as request from 'request-promise'
import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import defaultPicture from './components/img/default.jpg'


const Materialize = window.Materialize

const APP_TITLE = 'Poke'
//update document title (displayed in the opened browser tab)
document.title = APP_TITLE

//web api utils
import { get, ENDPOINTS } from './utils/api'

//components
import PokemonCard from './components/PokemonCard'

class App extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            pokemon: undefined,
            id_Pokemon: ''
        }
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>{ APP_TITLE }</h1>
                    <img src={ logo } className="App-logo" alt="logo" />
                </div>

                <div className="App-content">
                    <div className="center-align">

                        <form onSubmit={ this.fetchPokemon }>

                            <div className="row" style={ { marginBottom: 0 } }>
                                <div className="input-field col s6 offset-s3">
                                    <input id="pokemonId" type="text" value={ this.state.id_Pokemon } onChange={ this.handleChange } />
                                    <label htmlFor="pokemonId">Pokemon - Id Ex : 25</label>
                                </div>
                            </div>

                            <button type="submit" className="waves-effect waves-light btn">
                                GoPokemon!
                            </button>

                        </form>

                    </div>

                    <div className="row" style={ { marginTop: 20 } } >
                        <div className="col s12 m6 offset-m3">
                            { this.displayPokemonInfo() }
                        </div>
                    </div>
                </div>

            </div>
        )
    }



    handleChange = ( event ) => {
        this.setState( {
            id_Pokemon: event.target.value
        } )
    }

    fetchPokemon = async ( event ) => {

        event.preventDefault()

        try {
            let pokemon = await request.get( {
                json: true,
                uri: ENDPOINTS.POKEMON_API_URL + this.state.id_Pokemon
                })

            if (pokemon.name) {
                let updatedpokemonWithImage = await this.fetchCaract( pokemon )
                this.setState( {
                    pokemon: updatedpokemonWithImage
                } )
            }
            //handling error
            else {
                Materialize.toast('Erreur', 8000, 'error-toast' )
            }


        }
        catch ( error ) {
            Materialize.toast( 'ERROR enter an Id between [1 - 721] ', 8000, 'error-toast' )
            console.log( 'Failed fetching data: ', error )
        }
    }

    fetchCaract = async ( pokemon ) => {
        try {

            const caracts = await request.get({
                json: true,
                uri: ENDPOINTS.CATCH_API_URL + this.state.id_Pokemon
                })

            if (caracts.flavor_text_entries[1].flavor_text) {
                pokemon.caracteristique = caracts.flavor_text_entries[1].flavor_text
            }
            else {
                pokemon.caracteristique = "- no informations -"
            }

            if (caracts.capture_rate) {
                pokemon.catchRate = caracts.capture_rate
            }
            else {
                pokemon.catchRate = "- no informations -"
            }

        }
        catch ( error ) {

            pokemon.catchRate = "- no informations -"
            console.log( 'Failed fetching picture: ', error )
        }

        return pokemon
    }    

    displayPokemonInfo = () => {
        const pokemon = this.state.pokemon
        
        if ( pokemon ) {
            const pokemonName = pokemon.name
            const pokemonCaract = pokemon.caracteristique
            const pokemonType = pokemon.types[0].type.name.replace(/\b\w/g, l => l.toUpperCase())
            const pokemonId = pokemon.id
            const pokemonCatchRate = pokemon.catchRate
            const picture = pokemon.sprites.front_default

            return (
                <PokemonCard
                    pokemonName={ pokemonName }
                    pokemonCatchRate={ pokemonCatchRate }
                    picture={ picture } />
            )
        }

        return null
    }

}

export default App