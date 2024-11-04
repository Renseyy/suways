def randomInt min\number, max\number
	min = Math.ceil min
	max = Math.floor max
	return Math.floor Math.random() * (max - min + 1) + min

def getMatrix
	let matrix = []
	for i in [0 ... 20]
			matrix[i] = []
			for j in [0 ... 20]
				matrix[i][j] = randomInt 1, 9

export tag Suway
	matrix\number[][] = getMatrix!
	done\Set<string> = new Set()

	currentPoint\[number, number] = [0, 0]

	def handleWay e\KeyboardEvent
		if e.key is 'ArrowRight'
			done.add `{currentPoint[0]}x{currentPoint[1]}`
			currentPoint[1]++
		else if e.key is 'ArrowDown'
			done.add `{currentPoint[0]}x{currentPoint[1]}`
			currentPoint[0]++
		console.log currentPoint

	<self>
		<table tabIndex=0 @keydown=handleWay> for i in [0 ... 20]
			css border-collapse:collapse bd:1px,solid,black
			<tr> for j in [0 ... 20]
				let isDone = done.has `{i}x{j}`
				let isCurrentPoint = (currentPoint[0] is i) and (currentPoint[1] is j)
				<td .done=isDone .currentPoint=isCurrentPoint>
					css s: 20px ta:center c:blue8 bd:1px,solid,black 
					css .done c:red4 bg:green4
					css .currentPoint bg:yellow4	
		
					matrix[i][j]
