const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')

const btnDownload = document.getElementById('btn-download')
const btnUndo = document.getElementById('btn-undo')
const btnClear = document.getElementById('btn-clear')

const lineWidth = document.getElementById('line-width')
const strokeStyle = document.getElementById('stroke-style')
const projectName = document.getElementById('project-name')

let isDrawing = false
let arrayImage = []
let arrayImageIndex = -1

canvas.height = window.innerHeight - 400
canvas.width = window.innerWidth - 40
ctx.fillStyle = 'transparent'
ctx.lineCap = 'round'
ctx.lineJoin = 'round'

const midPointBetween = (p1, p2) => {
	return {
		x: p1.x + (p2.x - p1.x) / 2,
		y: p1.y + (p2.y - p1.y) / 2
	}
}

const getCoordinateXandY = (e) => {
	var source = e.touches ? e.touches[0] : e

	return {
		x: source.clientX - canvas.offsetLeft,
		y: source.clientY - canvas.offsetTop
	}
}

const drawing = (e) => {
	if (!isDrawing) return

	arrayImage.push(getCoordinateXandY(e))

	switch(lineWidth.value >= 0){
		case true:
			ctx.lineWidth = lineWidth.value
		break
		default:
			ctx.lineWidth = 1
		break
	}
	ctx.strokeStyle = strokeStyle.value
	var coor = getCoordinateXandY(e)
	var lastCoor = arrayImage[arrayImage.length - 2]
	var midCoor = midPointBetween(lastCoor, coor)

	ctx.quadraticCurveTo(lastCoor.x, lastCoor.y, midCoor.x, midCoor.y)
	ctx.stroke()
	ctx.beginPath()
	ctx.moveTo(midCoor.x, midCoor.y)
	

	

}

const clearCanvas = () => {
	ctx.fillStyle = 'transparent'
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	arrayImage = []
	arrayImageIndex = -1
}

const stopDraw = (e) => {
	isDrawing = false 
	ctx.beginPath()

	if(e.type != 'mouseout'){
		arrayImage.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
		arrayImageIndex += 1
	}
}

const startDraw = (e) => {
	isDrawing = true
	arrayImage.push(getCoordinateXandY(e))
	// draw(e)
}

btnDownload.addEventListener('click', () => {
  	let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  	let el = document.createElement('a')
  	let filename = projectName.value != '' ? projectName.value +'.png' : 'paint-wannabe.png'
  	
  	el.setAttribute('href', image)
  	el.setAttribute('download', filename)
  	el.click()
})

btnUndo.addEventListener('click', () => {
	switch(arrayImageIndex <= 0) {
		case true:
			clearCanvas()
		break
		default:
			arrayImageIndex -= 1
			arrayImage.pop()
			ctx.putImageData(arrayImage[arrayImageIndex], 0, 0)
		break
	}
})

btnClear.addEventListener('click', clearCanvas)

canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDraw)
canvas.addEventListener('mouseout', stopDraw)
canvas.addEventListener('mouseout', stopDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mousedown', startDraw)

canvas.addEventListener('touchstart', startDraw)
canvas.addEventListener('touchmove', drawing)
canvas.addEventListener('touchend', stopDraw)