let currentAnimation
let currentData
let currentFileName
let isPlaying = false
let isReversed = false
const loadFile = async file => {
if (!file) {
setStatus('Please select a .tgs or .json file', 'error')
return
}
setStatus('Loading')
try {
let data
if (file.name.toLowerCase().endsWith('.tgs')) {
const buffer = await readArrayBuffer(file)
const inflated = window.pako.inflate(new Uint8Array(buffer))
const json = new TextDecoder('utf-8').decode(inflated)
data = JSON.parse(json)
} else if (file.name.toLowerCase().endsWith('.json')) {
const text = await readText(file)
data = JSON.parse(text)
} else {
setStatus('Unsupported format. Use .tgs or .json', 'error')
return
}
if (!validateLottie(data)) {
setStatus('Invalid Lottie structure', 'error')
return
}
renderAnimation(data)
currentData = data
currentFileName = file.name.replace(/\.[^/.]+$/, '')
setControlsEnabled(true)
setStatus('Playing', 'ok')
} catch (e) {
setControlsEnabled(false)
setStatus('Failed to load file', 'error')
}
}
const readArrayBuffer = file =>
new Promise((resolve, reject) => {
const reader = new FileReader()
reader.onload = () => resolve(reader.result)
reader.onerror = () => reject(reader.error)
reader.readAsArrayBuffer(file)
})
const readText = file =>
new Promise((resolve, reject) => {
const reader = new FileReader()
reader.onload = () => resolve(reader.result)
reader.onerror = () => reject(reader.error)
reader.readAsText(file)
})
const validateLottie = data => {
return data && typeof data === 'object' && Array.isArray(data.layers) && typeof data.fr === 'number'
}
const renderAnimation = data => {
destroyAnimation()
currentAnimation = window.lottie.loadAnimation({
container: document.getElementById('animation'),
renderer: 'svg',
loop: true,
autoplay: true,
animationData: data
})
isPlaying = true
isReversed = false
currentAnimation.setSpeed(1)
currentAnimation.setDirection(1)
updateControlsUI()
}
const destroyAnimation = () => {
if (currentAnimation) {
currentAnimation.destroy()
currentAnimation = undefined
}
}
const downloadLottie = () => {
if (!currentData) {
setStatus('Nothing to download', 'error')
return
}
const blob = new Blob([JSON.stringify(currentData)], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `${currentFileName || 'animation'}.json`
document.body.appendChild(a)
a.click()
a.remove()
URL.revokeObjectURL(url)
setStatus('Downloaded Lottie', 'ok')
}
const setStatus = (text, type) => {
const el = document.getElementById('status')
el.textContent = text
el.classList.remove('error', 'ok', 'info')
if (type === 'error') el.classList.add('error')
if (type === 'ok') el.classList.add('ok')
}
const setControlsEnabled = enabled => {
const ids = ['playBtn', 'pauseBtn', 'restartBtn', 'downloadBtn', 'speedSlider']
for (const id of ids) {
const el = document.getElementById(id)
el.disabled = !enabled
}
if (!enabled) {
isPlaying = false
isReversed = false
updateControlsUI()
}
}
const updateControlsUI = () => {
const playBtn = document.getElementById('playBtn')
const pauseBtn = document.getElementById('pauseBtn')
const anyLoaded = Boolean(currentAnimation)
playBtn.classList.toggle('active', anyLoaded && isPlaying)
pauseBtn.classList.toggle('active', anyLoaded && !isPlaying)
}
const setupUI = () => {
const dropzone = document.getElementById('dropzone')
const fileInput = document.getElementById('fileInput')
const chooseBtn = document.getElementById('chooseBtn')
const playBtn = document.getElementById('playBtn')
const pauseBtn = document.getElementById('pauseBtn')
const restartBtn = document.getElementById('restartBtn')
const downloadBtn = document.getElementById('downloadBtn')
const themeToggle = document.getElementById('themeToggle')
const speedSlider = document.getElementById('speedSlider')
const speedValue = document.getElementById('speedValue')
dropzone.addEventListener('dragenter', e => {
e.preventDefault()
dropzone.classList.add('active')
applyDragValidation(e, dropzone)
})
dropzone.addEventListener('dragover', e => {
e.preventDefault()
dropzone.classList.add('active')
applyDragValidation(e, dropzone)
})
dropzone.addEventListener('dragleave', e => {
e.preventDefault()
dropzone.classList.remove('active')
dropzone.classList.remove('valid', 'invalid')
})
dropzone.addEventListener('drop', async e => {
e.preventDefault()
dropzone.classList.remove('active')
dropzone.classList.remove('valid', 'invalid')
const files = e.dataTransfer.files
if (files && files[0]) {
await loadFile(files[0])
}
})
chooseBtn.addEventListener('click', () => fileInput.click())
fileInput.addEventListener('change', async e => {
const files = e.target.files
if (files && files[0]) {
await loadFile(files[0])
fileInput.value = ''
}
})
playBtn.addEventListener('click', () => {
if (currentAnimation) {
currentAnimation.play()
isPlaying = true
updateControlsUI()
setStatus('Playing')
}
})
pauseBtn.addEventListener('click', () => {
if (currentAnimation) {
currentAnimation.pause()
isPlaying = false
updateControlsUI()
setStatus('Paused')
}
})
restartBtn.addEventListener('click', () => {
if (currentAnimation) {
currentAnimation.goToAndPlay(0, true)
isPlaying = true
updateControlsUI()
setStatus('Restarted')
}
})
downloadBtn.addEventListener('click', downloadLottie)
speedSlider.addEventListener('input', () => {
const v = Number(speedSlider.value)
speedValue.textContent = `${v.toFixed(2)}×`
if (currentAnimation) {
currentAnimation.setSpeed(v)
}
})
const applyTheme = t => {
document.documentElement.setAttribute('data-theme', t)
themeToggle.textContent = t === 'dark' ? 'Light Mode' : 'Dark Mode'
}
const initTheme = () => {
const saved = localStorage.getItem('theme') || 'dark'
applyTheme(saved)
}
themeToggle.addEventListener('click', () => {
const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
applyTheme(now)
localStorage.setItem('theme', now)
})
initTheme()
window.addEventListener('keydown', e => {
if (e.code === 'Space') {
e.preventDefault()
if (!currentAnimation) return
if (isPlaying) {
pauseBtn.click()
} else {
playBtn.click()
}
}
if (e.code === 'KeyR') {
if (!currentAnimation) return
restartBtn.click()
}
})
setControlsEnabled(false)
}
const applyDragValidation = (e, dropzone) => {
try {
const items = e.dataTransfer?.items
if (!items || items.length === 0) return
let valid = false
for (const it of items) {
if (it.kind === 'file') {
const f = it.getAsFile()
const name = f?.name?.toLowerCase() || ''
if (name.endsWith('.tgs') || name.endsWith('.json')) {
valid = true
break
}
}
}
dropzone.classList.toggle('valid', valid)
dropzone.classList.toggle('invalid', !valid)
} catch {
}
}
document.addEventListener('DOMContentLoaded', setupUI)
