import MultipleChoice from "./MultipleChoice"

const DATA = {
  options: ["React", "Vue", "Angular", "Svelte"],
  votes: [0, 0, 0, 0]
}

const GameStateController = () => {
  return (
    <div><MultipleChoice options={DATA.options} votes={DATA.votes}/></div>
  )
}

export default GameStateController