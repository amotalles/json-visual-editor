
import SampleJson   from 'raw!../samples/simple.json';
import {ValidationClass, Actions} from '../Constants.js'

const initialState =  {
  data: null,
  text: '',
  autoFormat: false,
  valid: ValidationClass.None,
  expanded: {}
}

const reducer = (state = initialState, action) => {

  const _setText = (state, action) => {
    let text = action.newText || ''
    let data = state.data
    let valid = state.valid
    if (text.length > 0) {
      try {
        // set data
        data = JSON.parse(text);
        // format
        if (state.autoFormat) {
          text = JSON.stringify(data, null, 2);
        }
        valid = ValidationClass.Valid
      } catch(e) {
        data = null
        valid = ValidationClass.Invalid
      }
    }
    else {
      data = null
      valid = ValidationClass.Invalid
    }
    return [text, data, valid]
  }

  switch (action.type) {

  /*
   * Set and parse text, and update data
   */
  case Actions.SetText: {
    const [text, data, valid] = _setText(state, action)
    // return new state
    return Object.assign({}, state, {
      text: text,
      data: data,
      valid: valid
    });
  }

  /*
   * Just update the textarea.
   */
  case Actions.UpdateText: {
    return Object.assign({}, state, {
      text: action.newText
    });
  }

  case Actions.ClearText:
    return Object.assign({}, state, {
      text: '',
      data: null
    });

  case Actions.CopyText:
    return state;

  case Actions.PasteSample: {
    action.newText = SampleJson
    const [text, data, valid] = _setText(state, action)
    return Object.assign({}, state, {
      text: text,
      data: data,
      valid: valid
    })
  }

  case Actions.SetAutoFormat:
    return Object.assign({}, state, {
      autoFormat: action.enabled
    });

  case Actions.ResetValid:
    return Object.assign({}, state, {
      valid: ValidationClass.None
    });

  case Actions.ToggleExpanded: {
    const pos = action.position
    let expanded = state.expanded || {}
    if (pos in expanded) {
      expanded[pos] = !expanded[pos]
    }
    else {
      expanded[pos] = false
    }
    return Object.assign({}, state, {
      expanded: expanded
    })
  }

  default:
    return state;
  }
}

export default reducer