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

canvas.height = window.innerHeight - 180
canvas.width = window.innerWidth - 40
ctx.fillStyle = 'transparent'
ctx.lineCap = 'round'
ctx.lineJoin = 'round'

const draw = (e) => {
	if (!isDrawing) return

	switch(lineWidth.value >= 0){
		case true:
			ctx.lineWidth = lineWidth.value
		break
		default:
			ctx.lineWidth = 1
		break
	}

	ctx.strokeStyle = strokeStyle.value

	ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
	ctx.stroke()
	ctx.beginPath()
	ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
	ctx.closePath()
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

const setIsDrawingTrueAndDraw = (e) => {
	isDrawing = true 
	draw(e)
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

canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDraw)
canvas.addEventListener('mouseout', stopDraw)
canvas.addEventListener('mouseout', stopDraw)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mousedown', setIsDrawingTrueAndDraw)

canvas.addEventListener('touchstart', (e)=> {
	setIsDrawingTrueAndDraw(e)
})
canvas.addEventListener('touchmove', (e) => {
	setIsDrawingTrueAndDraw(e)
})
canvas.addEventListener('touchend', (e) => {
	stopDraw(e)
})
canvas.addEventListener('touchcancel', (e) => {
	stopDraw(e)
})
