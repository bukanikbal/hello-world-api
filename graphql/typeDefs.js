// [
//   {
//     _id: new ObjectId("6277c34d221dfb7995c6e3ba"),
//     sender: {
//       _id: new ObjectId("6277c148221dfb7995c6e3b5"),
//       username: 'mifta',
//       password: '12345',
//       profile: [Object]
//     },
//     receiver: {
//       _id: new ObjectId("6277c0d7221dfb7995c6e3b4"),
//       username: 'iqbal',
//       password: '12345',
//       profile: [Object]
//     },
//     value: 'halo,kabar baik',
//     last: true
//   }
// ]

import * as apollo from 'apollo-server-express'

export default apollo.gql`
  type Query {
    all(sender:String,receiver:String) : [Message],
    auth(username:String,password:String) : User,
    recently(_id:String) : [Recently]
    search(query:String) : [User]
  }
  type Mutation {
    new(param: NewMessage) : Message
    read(param: MessageStatus) : MessageUpdate
  }
  type User{
    _id: String,
    profile : Profile
  }
  type Profile {
    _id: String,
    firstName: String,
    lastName: String,
    picture: String
  }
  type Content {
    type: String,
    value: String
  }
  type Message{
    _id : String,
    sender: String,
    receiver: String, 
    content : Content,
    uniqueId: String,
    read: Boolean,
    send: Boolean
  }
  type MessageUpdate{
    _id : String,
    sender: String,
    receiver: String,
    content: Content,
    uniqueId: String,
    read: Boolean
  }
  type Recently{
    _id: String,
    sender: User,
    receiver: User,
    content: Content,
    read: Boolean
  }
  input NewMessage{
    _id: String,
    read: Boolean,
    sender: String,
    receiver: String,
    content: MessageContent,
    uniqueId: String
  }
  input MessageStatus{
    _id : String,
    update: MessageStatusUpdate,
    options: MessageUpdateOpts
  }
  input MessageContent{
    type: String,
    value: String
  }
  input MessageStatusUpdate{
    read: Boolean
  }
  input MessageUpdateOpts{
    new: Boolean
  }
`
