import utils from 'mk-utils'
import ReactDOM from 'react-dom'

export default class action {
    constructor(option) {
        this.metaAction = option.metaAction
    }

    onInit = ({ component, injections }) => {
        this.component = component
        this.injections = injections
    }

    fieldChange = async (fieldPath, value, checkFn) => {
        await this.check([{ path: fieldPath, value, checkFn }], true)
    }

    check = async (option, needSaveFieldValue) => {
        if (!option || !utils._.isArray(option))
            return

        var checkResults = []

        for (let child of option) {
            let checkResult

            if (child.checkFn) {
                checkResult = await child.checkFn({ path: child.path, value: child.value })
            }

            if (checkResult) {
                checkResults.push(checkResult)
            }
        }

        var hasError = false, json = {}
        if (needSaveFieldValue) {
            option.forEach(o => {
                json[o.path] = o.value
            })
        }

        if (checkResults.length > 0) {
            checkResults.forEach(o => {
                json[o.errorPath] = o.message
                if (o.message)
                    hasError = true
            })
        }

        if (json) {
            this.metaAction.sfs(json)
        }
        return !hasError
    }

}
