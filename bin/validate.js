#!/usr/bin/env node

import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'
import validator from 'gltf-validator'

const validate = async () => {
  const filePath = path.join(process.cwd(), 'docs')
  const files = await fs.getFiles(filePath)

  await Promise.all(files.map(async file => {
    try {
      if (!file.endsWith('.gltf') && !file.endsWith('.glb')) {
        return
      }

      const asset = await fs.readFile(file)
      const report = await validator.validateBytes(new Uint8Array(asset))
      log.success('report:\n', report)

      const reportPath = path.join(process.cwd(), 'gltf-reports')
      await fs.mkdirp(reportPath)
      const fileName = path.basename(file)
      await fs.writeFile(path.join(reportPath, fileName), JSON.stringify(report, null, 2))
    } catch (e) {
      log.error('error', e)
    }
  }))
}

validate()