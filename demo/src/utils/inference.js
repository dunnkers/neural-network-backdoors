
export function softmax(arr) {
    const C = Math.max(...arr);
    const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
    return arr.map(value => { 
        return Math.exp(value - C) / d;
    });
}

export function argmax(arr) {
    if (arr.reduce((a, b) => a + b, 0) !== 0) return -1
    return arr.reduce((argmax, n, i) => (
        n > arr[argmax] ? i : argmax), 0)
}
  
export async function infer(model, session, tensor) {
    const start = new Date();
    const outputData = await session.run([ tensor ]);
    const end = new Date();
    const time = (end.getTime() - start.getTime());
    const output = outputData.values().next().value;
    const { probabilities, prediction } = model.postprocess(output.data);
    return { time, probabilities, prediction }
}