import { Suway } from './suway'
import 'remixicon/fonts/remixicon.css'

global css @root
	inset:0
	bgc: warm3
	d: hcc

tag app
	css
		p: 24px
		rd: 16px
		of: hidden
		bg: white
	count = 0
	<self>
		<Suway>

imba.mount <app>
