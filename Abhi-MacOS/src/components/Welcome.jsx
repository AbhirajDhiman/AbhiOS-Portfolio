import { useEffect, useRef } from 'react'
import gsap from 'gsap'
const renderText=(text,className,baseWeight=400)=>{
    return [...text].map((char,i)=>(
        <span key={i} className={className} style={{fontVariationSettings: `"wght" ${baseWeight}`}}>
            {char === " " ? "\u00A0" : char}
        </span>
    ))
}
const FONT_WEIGHTS={
    subtitle:{min:100,max:400,default:100},
    title:{min:400,max:900,default:400}
}
const setupTextHover = (container, minWeight, maxWeight) => {
    if (!container) return () => {}

    const letters = [...container.querySelectorAll('span')]
    const animateLetter = (letter, weight) => {
        gsap.to(letter, {
            duration: 0.25,
            ease: 'power2.out',
            fontVariationSettings: `"wght" ${weight}`,
            overwrite: true,
        })
    }

    const handleMouseMove = (event) => {
        const { left } = container.getBoundingClientRect()
        const mouseX = event.clientX - left

        letters.forEach((letter) => {
            const { left: letterLeft, width } = letter.getBoundingClientRect()
            const distance = Math.abs(mouseX - (letterLeft - left + width / 2))
            const intensity = Math.exp(-(distance ** 2) / 20000)
            animateLetter(letter, minWeight + (maxWeight - minWeight) * intensity)
        })
    }

    const resetLetters = () => {
        letters.forEach((letter) => animateLetter(letter, minWeight))
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', resetLetters)

    return () => {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseleave', resetLetters)
        gsap.killTweensOf(letters)
    }
}


const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef=useRef(null);

    useEffect(() => {
        const cleanTitle = setupTextHover(titleRef.current, 400, 900)
        const cleanSubtitle = setupTextHover(subtitleRef.current, 300, 700)

        return () => {
            cleanTitle()
            cleanSubtitle()
        }
    }, [])

  return (
     <section id="welcome">
      <p ref={subtitleRef} className="font-georama text-center">{renderText("Hey, I'm Abhiraj! Welcome to my Portfolio", "font-medium text-3xl font-georama text-center", 500)}</p>
      <h1 ref={titleRef} className="mt-7 font-georama text-center">
        {renderText("portfolio", 'text-9xl italic font-semibold font-georama', 600)}
     </h1>

     <div className="small-screen">
        <p>This Portfolio is designed for desktop/tablet screens only.</p>
     </div>
    </section>
  )
}

export default Welcome
 