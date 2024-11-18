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
		# zi: 1
		ff: sans
		font-variant-numeric: tabular-nums
		s: 20px
		ta:center
		c: gray7
		bg: white
		# bd:1px, solid, black

	css .done bg: black fw: 800 c: white
	css .currentPoint
		bg: #215a89
		fw: 800
		c: white
		pos:relative
		# animation: scale 1s infinite
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

	css .arrow
		c: #215a89
		s: 8px
		bg: transparent
		pos:absolute
		animation: scale 1s infinite
		# box-shadow: 0px 0px 10px black
		zi: -1
		@keyframes scale
			0% transform: rotate(-45deg) scale(1)
			50% transform: rotate(-45deg) scale(1.2)
			100% transform: rotate(-45deg) scale(1)

	score\number = 0
	matrix\number[][] = getMatrix!
	done\Set<string> = new Set!
	isIntroPlaying = false
	miniLogoHide = true
	init = true
	time\number = 0


	currentPoint\[number, number] = [19, 19]

	def reset
		init = false
		score = 0
		time\number = 45_000
		matrix = getMatrix!
		done = new Set!
		currentPoint = [0, 0]
		isIntroPlaying = true
		miniLogoHide = true
		subtractApp!

	def handleWay e\KeyboardEvent
		if time > 0
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

	def showAfter
		miniLogoHide = false

	def subtractApp
		time -= 10
		self.render!
		if time > 10 and currentPoint[0] != 19 and currentPoint[1] != 19
			setTimeout subtractApp.bind(this), 10

	def play
		time = 45_000
		subtractApp

	def playIntro
		console.log 'playIntro'
		$intro.play!
		setTimeout stopIntro.bind(this), 5_000

	def stopIntro
		console.log 'stopIntro'
		$intro.pause!
		setTimeout endIntro.bind(this), 7_000

	def endIntro
		console.log 'endIntro'
		$intro.play!

	def replayIntro
		console.log 'replay'
		setTimeout playIntro.bind(this), 1_000


	<self>
		css
			inset: 0
			s: 100%
			of: hidden
		<div>
			css
				s: 100%
				of: hidden
				bg: white
			<div>
				css
					of: hidden
					d: flex
					g: 40px
					jc: space-evenly
					ai: center
					s: 100%
				<div>
					css pos: relative
					<.topBar>
						css d: hcs
						<div>
							"Wynik:"
							<span.count> score
						<div>
							"Czas:"
							<span.count>
								(Math.round time / 1000)
								<span [fs: 400]> "s"
					<table.table> for i in [0 ... 20]
						<tr> for j in [0 ... 20]
							let isDone = done.has `{i}x{j}`
							let isCurrentPoint = (currentPoint[0] is i) and (currentPoint[1] is j)
							<td.cell .done=isDone .currentPoint=isCurrentPoint>
								if i is 0 and j is 0 or i is 19 and j is 19
									<i.flag=(currentPoint[0] != 19 or currentPoint[1] != 19) .ri-flag-2-fill>
								else
									matrix[i][j]

								if isCurrentPoint
									if(currentPoint[1] != 19)
										<div.arrow>
											css
												s: 8px
												bg: transparent
												pos:absolute
												r: -8px
												t: 8px
												bdr: 2px solid #215a89
												bdb: 2px solid #215a89
									if(currentPoint[0] != 19)
										<div.arrow>
											css
												s: 8px
												bg: transparent
												pos:absolute
												r: 6px
												b: -8px
												bdl: 2px solid #215a89
												bdb: 2px solid #215a89
					if currentPoint[0] == 19 and currentPoint[1] == 19
						<div ease>
							css
								pos: absolute
								s: 100%
								inset: -16px
								p: 16px
								rd: 8px
								bg: rgba(0, 0, 0, 0.7)
						if not init
							<div>
								css
									d: flex
									fld: column
									g: 24px
									pos: absolute
									l: 50%
									miw: 240px
									mih: 240px
									top: 50%
									transform: translate(-50%, -50%)
									bg: warm1
									p: 40px
									rd: 8px
									ff: sans
									jc: center
								<div>
									<div> "Twój wynik to"
										css fs: 16px
									<div> score + " punktów"
										css fs: 24px
								<div>
									<div> "Zdobyty w czasie"
									<div> (45_000 - time) + " ms"
										css fs: 24px
				<div>
					<div>
						<video$intro @loadeddata=playIntro muted @ended=replayIntro>
							<source src='/teambit_logo_full_white.mp4'  type="video/mp4">
							"Your browser does not support the video tag."
							css s: 1024px pe: none

						css
							d:flex
							ai: center
							jc:center
							of: hidden
							s: 512px
						if currentPoint[0] == 19 and currentPoint[1] == 19
							<button @click=reset ease> "Losuj planszę i rozpocznij"
								css
									bd: none
									p: 16px
									font: inherit
									rd: 8px
									bg: #215a89
									c: white
									fw: 800
									cursor: pointer
									pos: absolute
									ff: sans
									fw: 800
									b: 40px
								css @hover
									bg: warm4


