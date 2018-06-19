import { setContext } from "apollo-link-context"
import { createHttpLink } from "apollo-link-http"
import config from "config"
import { headers as requestIDHeaders } from "lib/requestIDs"
import fetch from "node-fetch"
import urljoin from "url-join"

import { middlewareLink } from "../lib/middlewareLink"

const { STRESS_API_BASE } = config

export const createStressLink = () => {
  const httpLink = createHttpLink({
    fetch,
    uri: urljoin(STRESS_API_BASE, "graphql"),
  })

  const authMiddleware = setContext((_request, context) => {
    const locals = context.graphqlContext && context.graphqlContext.res.locals
    const tokenLoader = locals && locals.dataLoaders.stressTokenLoader
    const headers = { ...(locals && requestIDHeaders(locals.requestIDs)) }
    // If a token loader exists for Convection (i.e. this is an authenticated request), use that token to make
    // authenticated requests to Convection.
    if (tokenLoader) {
      return tokenLoader().then(({ token }) => {
        return {
          headers: Object.assign(headers, { Authorization: `Bearer ${token}` }),
        }
      })
    }
    // Stress uses no authentication for now
    return { headers }
  })

  return middlewareLink.concat(authMiddleware).concat(httpLink)
}
