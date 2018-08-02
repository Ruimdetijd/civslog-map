import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import { battleSvg, aerialBattleSvg, birthSvg, deathSvg } from './svg'

const iconArgs = (iconString: string): any => ({
	src: 'data:image/svg+xml;utf8,' + iconString,
})

export const battleIconStyle = new Style({
	image: new Icon(iconArgs(battleSvg))
});

export const aerialBattleIconStyle = new Style({
	image: new Icon(iconArgs(aerialBattleSvg))
});

export const birthIconStyle = new Style({
	image: new Icon(iconArgs(birthSvg))
});

export const deathIconStyle = new Style({
	image: new Icon(iconArgs(deathSvg))
});