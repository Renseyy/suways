def randomInt min\number, max\number
	min = Math.ceil min
	max = Math.floor max
	return Math.floor Math.random() * (max - min + 1) + min

def getMatrix
	let matrix = []
	for i in [0 ... 20]
			matrix[i] = []
			for j in [0 ... 20]
				if i is 0 and j is 0 or i is 19 and j is 19
					matrix[i][j] = 0
				else
					matrix[i][j] = randomInt 1, 9

export tag Suway
	css .table  bd: none

	css .topBar
		pb: 24px
		fs: 20px
		ff: sans
		ta: right
		c: gray4
		d:flex

	css .count
		pl: 8px
		c: black

	css .cell
		ff: sans
		font-variant-numeric: tabular-nums
		s: 20px
		ta:center
		c: black
		bg: white
		bd:1px, solid, black

	css .done bg: black fw: 800 c: white
	css .currentPoint
		bg: #215a89
		fw: 800
		c: white
		animation: scale 1s infinite
		@keyframes scale
			0% transform: scale(1)
			50% transform: scale(1.2)
			100% transform: scale(1)


	css .flag::before
		d: block
		origin: bottom left
		animation: shake 3s infinite
		@keyframes shake
			0% transform: translateX(0)
			5% transform: translateY(-4px)
			10% transform: translateY(-4px) rotate(7deg)
			15% transform: translateY(-4px) rotate(-17deg)
			20% transform: translateY(-4px) rotate(7deg)
			25% transform: translateY(-4px) rotate(-17deg)
			30% transform: translateY(0) rotate(0)


	score\number = 0
	matrix\number[][] = getMatrix!
	done\Set<string> = new Set!

	currentPoint\[number, number] = [0, 0]

	def reset
		score = 0
		matrix = getMatrix!
		done = new Set!
		currentPoint = [0, 0]

	def handleWay e\KeyboardEvent
		if e.key is 'ArrowRight' and currentPoint[1] < 19
			done.add `{currentPoint[0]}x{currentPoint[1]}`
			currentPoint[1]++
			score += matrix[currentPoint[0]][currentPoint[1]]

		else if e.key is 'ArrowDown' and currentPoint[0] < 19
			done.add `{currentPoint[0]}x{currentPoint[1]}`
			currentPoint[0]++
			score += matrix[currentPoint[0]][currentPoint[1]]
		self.render!

	def mount
		document.body.addEventListener 'keydown', do(e)
			e.preventDefault!
			handleWay e

	<self>
		css
			of: hidden
			d: flex
			g: 40px
			ai: center
		<div>
			<.topBar>
				"Wynik:"
				<span.count> score
			<table.table> for i in [0 ... 20]
				<tr> for j in [0 ... 20]
					let isDone = done.has `{i}x{j}`
					let isCurrentPoint = (currentPoint[0] is i) and (currentPoint[1] is j)
					<td.cell .done=isDone .currentPoint=isCurrentPoint>
						if i is 0 and j is 0 or i is 19 and j is 19
							<i.flag=(currentPoint[0] != 19 or currentPoint[1] != 19) .ri-flag-2-fill>
						else
							matrix[i][j]
		<div>
			<div>
				<video autoplay muted>
					<source src='/teambit_logo_in_white.mp4'  type="video/mp4">
					"Your browser does not support the video tag."
					css s: 1024px
				css
					d:flex
					ai: center
					jc:center
					of: hidden
					s: 512px
		if currentPoint[0] == 19 and currentPoint[1] == 19
			<div ease>
				css
					pos: absolute
					s: 100%
					inset: 0
					bg: rgba(0, 0, 0, 0.7)
			<div>
				css
					d: flex
					fld: column
					g: 24px
					pos: absolute
					l: 50%
					top: 50%
					transform: translate(-50%, -50%)
					bg: warm1
					p: 24px
					rd: 8px

				"Udało ci się przejść z naszą planszę z wynikiem {score}!"
					css fs: 16px
				<button @click=reset> "Ja chcę jeszcze raaz!"
					css
						bd: none
						p: 8px
						font: inherit
						rd: 8px
						bg: warm3
						cursor: pointer
					css @hover
						bg: warm4

