import { lambdaWrapper, getParameters } from "@libs/utils";

const eventDispatcher = async (event: any) => {
  try {    
    const { time, detail: { fieldName, input } } = event;

    return {
      'data': "processed"
    }
  } catch (e) {
    console.error(e.message);
    throw e
  }
};

exports.handler = lambdaWrapper(eventDispatcher, {
  name: 'eventDispatcher'
});