// const { OpenAI } = require("openai");
// const openai = new OpenAI();



// export async function get_next_response(history){

//     await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: history
//     }).then((completion) => {
//         return completion.choices[0].message.content;
//     })
// }

// // async function main() {
// //   const completion = await openai.chat.completions.create({
// //     messages: [{ role: "system", content: "who are you." }],
// //     model: "gpt-3.5-turbo",
// //   });

// //   console.log(completion.choices[0]);
// // }

// // main();