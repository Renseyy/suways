import { Suway } from './suway.imba'
import 'remixicon/fonts/remixicon.css'

global css @root
	inset:0
	bgc: warm3
	d: hcc

tag app
	count = 0
	<self>
		<Suway>

imba.mount <app>
