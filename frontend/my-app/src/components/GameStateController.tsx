import { ClickerEvent, Loading, MultipleChoice } from '@/components'

const DATA = {
  type: 'Q&A',
  options: ["React", "Vue", "Angular", "Svelte"],
  votes: [0, 0, 0, 0]
}

const GameStateController = () => {
  let GAME_CONTENT: JSX.Element;

  switch(DATA.type) {
    case 'Q&A':
      GAME_CONTENT = <MultipleChoice options={DATA.options} votes={DATA.votes} />
      break;
    case 'Clicker':
      GAME_CONTENT = <ClickerEvent />
      break;
    default:
      GAME_CONTENT = <Loading />
  }

  return (
    <div>{GAME_CONTENT}</div>
  )
}

export default GameStateController;
