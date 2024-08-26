const initialState = {
  gpts: [],
};

const gptReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_GPT':
      return {
        ...state,
        gpts: [...state.gpts, action.payload],
      };
    case 'EDIT_GPT':
      return {
        ...state,
        gpts: state.gpts.map(gpt =>
          gpt.id === action.payload.id ? action.payload : gpt
        ),
      };
    default:
      return state;
  }
};

export default gptReducer;
