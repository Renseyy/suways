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
	css .table border-collapse:collapse bd: none

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
		s: 24px
		ta:center
		c:black
		bd:1px, solid, black

	css .done bg:gray3
	css .currentPoint bg: green2

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
	done\Set<string> = new Set()

	currentPoint\[number, number] = [0, 0]


	def handleWay e\KeyboardEvent
		if e.key is 'ArrowRight'
			done.add `{currentPoint[0]}x{currentPoint[1]}`
			score += matrix[currentPoint[1]][currentPoint[0]]
			currentPoint[1]++
		else if e.key is 'ArrowDown'
			done.add `{currentPoint[0]}x{currentPoint[1]}`
			score += matrix[currentPoint[1]][currentPoint[0]]
			currentPoint[0]++
		self.render!

	def mount
		document.body.addEventListener 'keydown', do(e) handleWay e

	<self>
		<.topBar>
			"Wynik:"
			<span.count> score
		<table.table> for i in [0 ... 20]
			<tr> for j in [0 ... 20]
				let isDone = done.has `{i}x{j}`
				let isCurrentPoint = (currentPoint[0] is i) and (currentPoint[1] is j)
				<td.cell .done=isDone .currentPoint=isCurrentPoint>
					if i is 0 and j is 0 or i is 19 and j is 19
						<i.flag .ri-flag-2-fill>
					else
						matrix[i][j]

