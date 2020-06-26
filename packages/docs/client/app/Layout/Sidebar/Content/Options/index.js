import React from 'react'
import { observer, useValue } from 'startupjs'
import { Br, Input, Button, Modal } from '@startupjs/ui'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons'
import {
  useShowGrid,
  useShowSizes,
  // useValidateWidth,
  useDarkTheme
} from '../../../../../clientHelpers'
import './index.styl'

export default observer(function Options ({
  style
}) {
  const [open, $open] = useValue(false)
  const [, $showGrid] = useShowGrid()
  // TODO: figure out why getting showSizes here leads to a bug of being non-reactive
  //       initially. While $showSizes.get() works fine for some reason.
  const [, $showSizes] = useShowSizes()
  // const [, $validateWidth] = useValidateWidth()
  const [, $darkTheme] = useDarkTheme()

  return pug`
    Button(
      style=style
      icon=faSlidersH
      color='darkLight'
      variant='text'
      onPress=() => $open.set(true)
    )
    Modal(
      title='Settings'
      visible=open
      onDismiss=() => $open.set(false)
      dismissLabel='Close'
    )
      Input.input(type='checkbox' label='Dark theme' $value=$darkTheme)
      if $showSizes.get()
        //- TODO: Maybe bring width check back in future
        // Input.input(type='checkbox' label='Validate width' $value=$validateWidth)
        Input.input(type='checkbox' label='Show grid' $value=$showGrid)
      Input.input(type='checkbox' label='Show sizes' $value=$showSizes)
      Br(half)
  `
})
