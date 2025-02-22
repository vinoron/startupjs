import { Strategy } from 'passport-linkedin-oauth2'
import passport from 'passport'
import nconf from 'nconf'
import initRoutes from './initRoutes'
import Provider from './Provider'

import { CALLBACK_LINKEDIN_URL } from '../isomorphic'

function validateConfigs ({ clientId, clientSecret }) {
  if (!clientId) {
    throw new Error('[@dmapper/auth-linkedin] Error:', 'Provide Client Id')
  }
  if (!clientSecret) {
    throw new Error('[@dmapper/auth-linkedin] Error:', 'Provide Client Secret')
  }
}

export default function (config = {}) {
  this.config = {}

  const func = ({ model, router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      ...authConfig
      // Any defaults....
    }, config)

    validateConfigs(this.config)

    console.log('++++++++++ Initialization of LinkedIn auth strategy ++++++++++\n')

    const { clientId, clientSecret } = this.config

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ linkedin: { clientId } })

    passport.use(
      new Strategy(
        {
          clientID: clientId,
          clientSecret,
          // TODO: make multitentant
          callbackURL: nconf.get('BASE_URL') + CALLBACK_LINKEDIN_URL,
          profileFields: ['first-name', 'last-name', 'email-address', 'profile-picture'],
          scope: ['r_emailaddress', 'r_liteprofile'],
          state: true,
          passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, cb) => {
          let userId, err
          try {
            const { id, name, displayName, emails, photos } = profile
            const _profile = {
              id,
              name,
              displayName,
              email: emails.pop().value,
              picture: photos.pop()
            }

            const provider = new Provider(model, _profile, this.config)
            userId = await provider.findOrCreateUser({ req })
          } catch (e) {
            err = e
          }
          return cb(err, userId)
        }
      )
    )
  }

  func.providerName = 'linkedin'
  return func
}
