// @ts-check
import factories from "../api"
import config from "config"

const { STRESS_APP_ID } = config

export default (accessToken, opts) => {
  let stressTokenLoader
  const gravityAccessTokenLoader = () => Promise.resolve(accessToken)

  const { gravityLoaderWithAuthenticationFactory } = factories(opts)

  const gravityLoader = gravityLoaderWithAuthenticationFactory(
    gravityAccessTokenLoader
  )

  // This generates a token with a lifetime of 1 minute, which should be plenty of time to fulfill a full query.
  stressTokenLoader = gravityLoader(
    "me/token",
    { client_application_id: STRESS_APP_ID },
    { method: "POST" }
  )

  return {
    stressTokenLoader,
  }
}
