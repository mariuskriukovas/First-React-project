import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Button,
    Image,
    TouchableHighlight,
    TextInput,
    CheckBox
} from 'react-native';
import Card from "./Card";
import CardManager from "./CardManager";
import MenuElement from "./MenuElement";


export default class Menu extends React.Component
{
    state = {
        addNew:false,
        onGame:false,
        changeMode:false,

        cards:[],
        currentIndex:0,
        currentCard:null,
        MenuElements:[],
        MyDecks:null,
        newDeckName:"",
        MenuDeleteElements:[],
        elementID:-1,
        usedDeckNumber:0,
        renamedKey:0
    }


    constructor(props) {
        super(props);
        this.state.MyDecks = CardManager().createMyDecks()
        this.state.MenuElements = this.state.MyDecks.map(
            (x,index)=>{
                this.state.elementID++
                return(
                <View key={this.state.elementID}>
                    <MenuElement index  = {this.state.elementID}
                                 name = {x.name}
                                 changeMode={false}
                                 function = {this.selectDeck}
                    />
                </View>)
            }
        )
    }

    renameExistingOne=(key)=>
    {
        this.state.renamedKey = key
        this.pressAddNew()
    }

    createAndAddNewDeck=()=>
    {
        if(!this.state.changeMode) {
            this.state.elementID++
            this.state.MyDecks.push(CardManager().createNewDeck(this.state.newDeckName))
            this.state.MenuElements.push(
                <View key={this.state.elementID}>
                    <MenuElement index={this.state.elementID}
                                 name={this.state.newDeckName}
                                 deleteMode={false}
                                 function={this.selectDeck}
                    />
                </View>
            )
        }
        else
        {
            let findIndex = -1
            this.state.MenuElements.forEach(
                (x,index)=>
                {
                    if(x.key==this.state.renamedKey)
                    {
                        findIndex = index
                    }})
            console.log("netikiu kad radau index"+findIndex)
            this.state.MyDecks[this.state.renamedKey].name = this.state.newDeckName
            this.state.MenuElements[findIndex] = (
                <View key={this.state.renamedKey}>
                    <MenuElement index  = {this.state.renamedKey}
                                 name = {this.state.newDeckName}
                                 deleteMode={false}
                                 function = {this.selectDeck}
                    />
                </View>)
            this.state.renamedKey = -1
            this.pressRemoveOld()
        }
        this.goBackToMenuFromNewDeck()
    }

    goBackToMenuFromNewDeck=()=>
    {
        this.state.newDeckName = ""
        this.setState(prev => ({addNew: !prev.addNew}))
    }

    selectDeck=(deckNumber)=>
    {
        console.log(deckNumber)
        this.state.usedDeckNumber = deckNumber
        this.state.currentIndex = 0
        this.setState(prev => ({onGame: !prev.onGame}))
        this.state.cards = this.state.MyDecks[deckNumber].cards
        this.getCard()
    }

    removeOldElement = (index)=>
    {
        this.state.MenuElements.splice(index, 1)
        this.pressRemoveOld()
    }

    pressRemoveOld = ()=>
    {
        this.state.MenuDeleteElements = this.state.MenuElements.map(
            (x,index)=>{
                return(
                    <View key={x.key}>
                        <MenuElement index  = {x.key}
                                     deleteMode={true}
                                     name = {this.state.MyDecks[x.key].name}
                                     function = {this.removeOldElement}
                                     functionRename = {this.renameExistingOne}
                        />
                    </View>)
            }
        )
        this.setState(prev => ({changeMode: true}))
    }


    goBackToMenu=()=>
    {
        this.setState(prev => ({onGame: !prev.onGame}))
    }

    pressAddNew = ()=>
    {
        this.setState(prev => ({addNew: !prev.addNew}))
    }

    saveState= ()=>
    {
        this.state.currentIndex = 0
        this.state.MyDecks[this.state.usedDeckNumber].cards = this.state.cards
        CardManager().sortMyDeck(this.state.MyDecks[this.state.usedDeckNumber])
        this.selectDeck(this.state.usedDeckNumber)
    }

    getCard= ()=>
    {
        console.log("ilgis"+this.state.cards.length)
        if(this.state.cards.length === 0)
        {
            this.state.currentCard = CardManager().createNewCard("Empty deck","Empty deck",0)
        }
        else if(this.state.currentIndex<this.state.cards.length)
        {
            this.state.currentCard = this.state.cards[this.state.currentIndex]
            this.setState(prev => ({currentIndex: prev.currentIndex+1}))
        }
        else
        {
            this.state.currentIndex = 0
            /*
            this.state.currentIndex = 0
            this.state.MyDecks[this.state.usedDeckNumber].cards = this.state.cards
            CardManager().sortMyDeck(this.state.MyDecks[this.state.usedDeckNumber])
            this.selectDeck(this.state.usedDeckNumber)

             */
        }
    }

    doneRemoving = ()=>
    {
        this.setState(prev => ({changeMode: !prev.changeMode}))
    }


    addNewCard= (front,back)=>{
        console.log("gal sitas")
        this.state.cards.push(CardManager().createNewCard(front,back, 0))
    }


    changeToWrong = ()=>
    {
        console.log("wrong")
        this.getCard()
    }

    changeToRight= ()=>
    {
        this.getCard()
    }

    deleteThisCard= ()=>
    {
        console.log("on delete" + this.state.currentIndex)
        this.state.cards.splice(this.state.currentIndex-1,1)
        this.state.currentIndex = this.state.currentIndex-1
        this.getCard()
    }

    changeNewDeckName = (newDeckName) => {
        this.setState({newDeckName: newDeckName})
    }

    showMenu = ()=>
    {
        return(
            this.state.changeMode ?
                <View style={styles.container}>
                    <ScrollView>
                        {this.state.MenuDeleteElements}
                        <View style={styles.emptyContainer}/>
                        <Button title="Done"
                                onPress={() => this.doneRemoving()}
                                color = {'green'}
                        />
                    </ScrollView>
                </View>
                    :
            <View style={styles.container}>
                <ScrollView>
                    {this.state.MenuElements}
                    <View style={styles.emptyContainer}/>
                    <View style={styles.buttonContainer}>
                        <Button title="Add New"
                                onPress={() => this.pressAddNew()}
                                color = {'green'}
                        />
                        <View style={styles.smallestContainer}/>
                        <Button title="Change Old"
                                onPress={() => this.pressRemoveOld()}
                                color = {'red'}
                        />
                    </View>
                    <View style={styles.emptyContainer}/>

                </ScrollView>
            </View>
        )
    }

    CreateNewDeck= ()=>
    {
        return (
            <View style={styles.container}>
                <Text style = {styles.text}>
                    New Card Deck
                </Text>
                <TextInput
                    style={styles.input}
                    value={this.state.newDeckName}
                    onChangeText={this.changeNewDeckName}
                    multiline={true}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Add" color = {'green'} onPress= {() => this.createAndAddNewDeck()} />
                    <View style={styles.smallestContainer}/>
                    <Button title="Back" color = {'gray'} onPress= {() => this.goBackToMenuFromNewDeck()} />
                    </View>
            </View>
        )
    }


    render() {
        return (
            this.state.addNew ? <this.CreateNewDeck/>:
            this.state.onGame ? <Card onClose ={this.goBackToMenu}
                                      value={this.state.currentCard}
                                      onWrong ={this.changeToWrong}
                                      onRight ={this.changeToRight}
                                      onDelete ={this.deleteThisCard}
                                      addNewCard = {this.addNewCard}
                                      cards = {this.state.cards}  />
            : <this.showMenu/>)
        }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    picture: {
        width: 150,
        height: 150
    },
    touchable:
    {
        top:40,
    },
    text: {
        fontSize : 30
    },

    buttonContainer: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallestContainer: {
        width: 30,
        height: 20
    },
    emptyContainer: {
        height: 40
    },


    inputField: {
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        margin: 20,
        width:200
    }

});
