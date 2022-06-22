import userQuery  from './resolvers/query/user-query.js'
import messageQuery from './resolvers//query/message-query.js'
import messageMutation from './resolvers/mutation/message-mutation.js'

export default {
  Query : {
  	...userQuery,
  	...messageQuery
  },
  Mutation : {
  	...messageMutation
  }
}