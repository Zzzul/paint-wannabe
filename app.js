const canvas = document.getElementById('canvas')

let lineWidth = document.getElementById('line-width')
let strokeStyle = document.getElementById('stroke-style')
let btnDownload = document.getElementById('btn-download')
let btnUndo = document.getElementById('btn-undo')
let btnClear = document.getElementById('btn-clear')
let projectName = document.getElementById('project-name')

const ctx = canvas.getContext('2d')

let isDrawing = false
let arrayImage = []
let arrayImageIndex = -1

ctx.fillStyle = 'transparent'
canvas.height = window.innerHeight - 180
canvas.width = window.innerWidth - 30

function draw(e) {
	if (!isDrawing) return;

	if(lineWidth.value){
		ctx.lineWidth = lineWidth.value
	}else{
		ctx.lineWidth = 1
	}
	ctx.lineCap = 'round'
	ctx.lineJoin = 'round'
	ctx.strokeStyle = strokeStyle.value

	ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
	ctx.stroke()
	ctx.beginPath()
	ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
	ctx.closePath()
}

function clearCanvas(){
	ctx.fillStyle = 'transparent'
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	arrayImage = []
	arrayImageIndex = -1
}

function stopDraw(e){
	isDrawing = false 
	ctx.beginPath()

	if(e.type != 'mouseout'){
		arrayImage.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
		arrayImageIndex += 1
	}
}

canvas.addEventListener('touchstart', draw)
canvas.addEventListener('mousedown', draw)
canvas.addEventListener('touchmove', draw)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDraw)
canvas.addEventListener('mouseout', stopDraw)
canvas.addEventListener('touchend', stopDraw)
canvas.addEventListener('mouseup', stopDraw)
canvas.addEventListener('mouseout', stopDraw)
canvas.addEventListener('mousemove', draw)

canvas.addEventListener('mousedown', (e) =>  {
	isDrawing = true 
	draw(e)
})

btnDownload.addEventListener('click', () => {
  	let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  	let el = document.createElement('a');
  	let filename = projectName.value != '' ? projectName.value +'.png' : 'paint-wannabe.png';
  	
  	el.setAttribute('href', image);
  	el.setAttribute('download', filename);
  	el.click();
})

btnUndo.addEventListener('click', () => {
	if(arrayImageIndex <= 0){
		clearCanvas()
	}else{
		arrayImageIndex -= 1
		arrayImage.pop()
		ctx.putImageData(arrayImage[arrayImageIndex], 0, 0)
	}
})

btnClear.addEventListener('click', clearCanvas)
