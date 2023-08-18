import actions from '@/components/ImageEditor/actions';

const appReducer = (state, action) =>
  actions[action.type]
    ? actions[action.type](state, action.payload) || state
    : state;

export default appReducer;
