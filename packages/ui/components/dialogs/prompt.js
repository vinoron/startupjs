import React from 'react'
import Input from '../forms/Input'
import Br from '../Br'
import Span from '../typography/Span'
import { $dialog, openDialog } from './helpers'

export default async function prompt ({
  title,
  message,
  defaultValue
} = {}) {
  if (title && typeof title !== 'string') {
    throw new Error('[@startupjs/ui] alert: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const result = await new Promise(resolve => {
    openDialog({
      title,
      value: defaultValue,
      children: pug`
        Span= message
        Br(half)
        Input(
          type='text'
          $value=$dialog.at('value')
        )
      `,
      showCross: false,
      enableBackdropPress: false,
      cancelLabel: 'Cancel',
      confirmLabel: 'OK',
      onRequestClose: () => {
        $dialog.del('value')
      },
      onCancel: () => {
        resolve(null)
      },
      onConfirm: () => {
        const result = $dialog.get('value')
        resolve(result)
      }
    })
  })

  return result
}
