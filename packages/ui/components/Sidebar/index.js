import React from 'react'
import { observer } from 'startupjs'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import Div from '../Div'
import config from './config'
import './index.styl'

function Sidebar ({
  backgroundColor,
  children,
  open,
  position,
  width,
  renderContent = () => null,
  ...props
}) {
  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent()
    `
  }
  return pug`
    Div.root(styleName=[position])
      Div.sidebar(
        shadow='s'
        styleName={open}
        style={width, backgroundColor}
      )= _renderContent()
      Div.main= children
  `
}

Sidebar.propTypes = {
  backgroundColor: PropTypes.string,
  open: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

Sidebar.defaultProps = {
  backgroundColor: config.backgroundColor,
  open: config.open,
  position: config.position,
  width: config.width
}

export default observer(Sidebar)
