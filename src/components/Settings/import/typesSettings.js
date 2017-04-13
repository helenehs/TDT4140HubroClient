import React from 'react'
import {graphql} from 'react-apollo'
import {updateTypeSettings} from '../../../graphql/mutations'
import {getSettings} from '../../../graphql/queries'
import _ from 'lodash'
import Toggle from 'material-ui/Toggle';
import {Table,TableBody, TableRow, TableRowColumn} from '../utils'

 class Lines extends React.Component{
   constructor(props){
     super(props)
      let array = []
      let studentID = ''
      _.forEach(props.settings, (set)=>{
        studentID = set.studentID
          let settings = {
            name: set.name,
            settingsID: set.settingsID,
            value : set.value
          }
          array.push(settings)
      })
      this.state = {studentID, settings:array}
      this.renderList = this.renderList.bind(this)
      this.handleChange = this.handleChange.bind(this)
   }
   handleChange(event, isInputChecked){
     let settingsName = event.target.name
     let settingsId = event.target.id
     let settingsValue = isInputChecked

    this.props.mutate({
          variables: { studentId: this.state.studentID , settingsId, settingsName, settingsValue},
          refetchQueries:[{query:getSettings,
          variables:{studentId:this.state.studentID}}]
        }).then(({data})=>{
        let prevStateSettings = this.state
        let updatedSettings = data.updateUserSettings
        prevStateSettings.settings.map((el)=>{
          if (el.name === settingsName){
            el.value = updatedSettings.value
          }
          return el
        })

        this.setState({settings:prevStateSettings.settings})
      }
      )

   }
   renderList(){

     return(
       this.state.settings.map((element)=>{
         return(
           <TableRow key={element.name}>
           <TableRowColumn>
             {element.name}
           </TableRowColumn>
           <TableRowColumn>
             <Toggle
               id={element.settingsID}
               name={element.name}
               toggled={element.value}
               onToggle={this.handleChange}
               />
           </TableRowColumn>

           </TableRow>
         )
       })
     )

   }

    render(){
      return(
        <Table >

        <TableBody>
        {this.renderList()}
      </TableBody>
        </Table>
      )
    }
  }



  export default graphql(updateTypeSettings)(Lines)