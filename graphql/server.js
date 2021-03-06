import context from './context.js'
import typeDefs from './typeDefs.js'
import resolvers from './resolvers.js'
import * as apollo from 'apollo-server-express'

var graphqlServer = new apollo.ApolloServer({
  typeDefs,resolvers,context
})

export {graphqlServer}

// export default new apollo.ApolloServer({
//   typeDefs,resolvers,context
// })
