import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Title from '../../public/Title/Title';
import Input from '../../public/Input/Input';
import './FriendsPage.scss';
import ProfilePicture from '../../public/ProfilePicture/ProfilePicture';
import Button from '../../public/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import ProfilePage from '../ProfilePage/ProfilePage';

class FriendsPage extends Component {
   constructor(props) {
    super(props);
    this.state = {
      input_value: '', 
      profile: false
    }
   }

   handleInputChange = (e) => {
      const value = e.target.value;
      this.setState(prevState => ({
        ...prevState, input_value: value
      }))
  }

  componentDidMount() {
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'get_friends_data', 
      callback: () => true
    });
  }

  openPage(page) {
    this.props.history.push(page)
  }

  goBack = () => {
    this.setState(prevState => ({
      ...prevState, 
      profile: false
    }))
  }

  selectUser = (user_id) => {
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'select_friend_todos', 
      user_id,
      callback: () => this.setState(prevState => ({
                        ...prevState, 
                        profile: true
                      }))
    });
  }

  sendFriendRequest = (user_id) => {
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'send_friend_request', 
      user_id,
      callback: () => console.log("Send reuet")
    });
  }

  acceptFriendRequest = (user_id) => {
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'accept_friend_request', 
      user_id,
      callback: () => console.log("Accpeted")
    });
  }

  declineFriendRequest = (user_id) => {
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'decline_friend_request', 
      user_id,
      callback: () => console.log("Declined")
    });
  }

  removeFriend = (user_id) => {
    this.props.auth.eventHandler({
      type: 'FRIENDS', 
      name: 'remove_friend', 
      user_id,
      callback: () => console.log("Friend removed")
    });
  }

  filterFriends = (users) => {
    let users_list = [...users];
    users_list = users_list.filter(user => {
      if(this.state.input_value.length != 0) {
        if(user.full_name.toLowerCase().includes(this.state.input_value.toLocaleLowerCase())) {
          return user;
        }
      } else {
        return user;
      }
    })
    return users_list;
  }

   render() {
     if(!this.state.profile) {
       return ( 
         <div className="friends-page-container">
           <Title header={'Find new friends'}  
                   headerColor="#262626"
                   headerFontSize="40px"
                   subheader="# join other todoers" 
                   subheaderColor="#9639B3"
                   subheaderFontSize="24px"
                   textAlign="left"
                    />
           <Input type="text"
                        placeholder="Enter friend name"
                        value={this.state.input_value}
                        onChange={this.handleInputChange}
                        colors={ {
                          active: '#9639B3', inactive: '#CCCCCC'  
                        }}
                        empty={this.state.input_value == 0}
                        error={false}
                        errorEnabled={false}
                        icon={'search'}
                            />
            <FriendList users={this.filterFriends(this.props.users)} 
                        selectUser={this.selectUser}
                        sendFriendRequest={this.sendFriendRequest}
                        acceptFriendRequest={this.acceptFriendRequest}
                        declineFriendRequest={this.declineFriendRequest}/>
         </div>       
       )
      } else {
        return <ProfilePage user_id={this.props.auth.state.friends.user_id}
                            full_name={this.props.auth.state.friends.full_name} 
                            todo_list={this.props.auth.state.friends.todo_list}
                            goBack={this.goBack}
                            removeFriend={this.removeFriend}/>

      }
   }
}

function FriendList(props) {

  const users = [...props.users];

  const friends = [...users.filter( user => {
    return user.isFriend == true;
  })]

  const requests = [...users.filter( user => {
    return user.requestReceived == true;
  })]

  const sents = [...users.filter( user => {
    return user.requestSent == true;
  })]
  
  const others = [...users.filter ( user => {
    return (user.isFriend == false) && (user.requestReceived == false) && (user.requestSent == false)
  })]

  
  let list = []
  const foo = (userType) => {
    list.push(userType.map(user => {
      return (
        <Friend key={user.user_id}
                user_id={user.user_id}
                full_name={user.full_name} 
                isFriend={user.isFriend}
                requestReceived={user.requestReceived}
                requestSent={user.requestSent} 
                selectUser={() => props.selectUser(user.user_id)} 
                sendFriendRequest={() => props.sendFriendRequest(user.user_id)}
                acceptFriendRequest={() => props.acceptFriendRequest(user.user_id)}
                declineFriendRequest={() => props.declineFriendRequest(user.user_id)}
                />
      )
    }))
  }

    foo(requests)
    foo(friends);
    foo(sents);
    foo(others);

  // foo(users);

  return (
    <div className="friends-list-container">
      {list}
    </div>
  )
  
}

function Friend(props) {



  return (
    <div className={`friend ${(props.isFriend) ? '' : 'not-friend'}`}>
      <div className="left" onClick={props.selectUser}>
        <ProfilePicture color={(props.isFriend) ? '#9639B3' : ((props.requestReceived) ? '#12E56E' : '#FABA34')}/>
        <h3>{ props.full_name }</h3>
      </div>
      <div className="right">
        { 
          (!props.isFriend) ? 
            (props.requestSent) ? 
            <Button text="Request sent" 
                          bgColor={'white'} 
                          textColor="#FABA34" 
                          textAlign="center"
                          borderColor="#FABA34"
                          onClick={ () => console.log("Request already sent") } /> 
                          : (props.requestReceived) ? <div className="friend-buttons">
                                                          <button onClick={ props.acceptFriendRequest } className="green"><FontAwesomeIcon icon={faCheck} color={ '#12E56E' }/></button>
                                                          <button onClick={ props.declineFriendRequest } className="red"><FontAwesomeIcon icon={faTimesCircle} color={ '#FF408E' }/></button>
                                                      </div> 
                          :
            <Button text="Follow" 
                          bgColor={(props.isFriend) ? '#9639B3' : '#FABA34'} 
                          textColor="white" 
                          textAlign="center"
                          borderColor="white"
                          onClick={ props.sendFriendRequest } /> 
          : ''
        }
        
      </div>
    </div>
  )
}

export default withRouter(FriendsPage);
