import {ModeToggle} from "@/components/mode-toggle";

function Footer() {
  return (
    <footer className="
    flex justify-center items-center gap-2 p-4 bottom-0 absolute ">
          <p>Made with ❤️ by <a href="https://github.com/JinzoTun" target="_blank" className="underline">Jinzo</a> </p>
            <div className="  "><ModeToggle /></div>
    </footer>

  )
}

export default Footer