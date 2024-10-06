import { ITranslationDefinitions } from 'src/types/generic/TranslationDefinitions'
import actions from './actions.json'
import annotations from './annotations.json'
import boot from './boot.json'
import bottomIndicator from './bottomIndicator.json'
import common from './common.json'
import controls from './controls'
import dashboard from './dashboard.json'
import drawers from './drawers.json'
import elements from './elements.json'
import maintenance from './maintenance'
import reporter from './reporter'
import shortcuts from './shortcuts.json'
import windowBar from './windowBar.json'
import project from './project.json'
import statusCodes from './statusCodes.json'
import stubCapture from './stubCapture.json'
import tools from './tools.json'
import tooltips from './tooltips.json'

export default {
  translation: {
    actions,
    annotations,
    boot,
    bottomIndicator,
    common,
    controls,
    dashboard,
    drawers,
    elements,
    maintenance,
    project,
    reporter,
    shortcuts,
    statusCodes,
    stubCapture,
    tools,
    tooltips,
    windowBar,
  },
} as ITranslationDefinitions
