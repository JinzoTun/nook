
import {ModeToggle} from "@/components/mode-toggle";
function Footer() {
  return (
    <footer className=" text-sm w-full gap-4
    flex justify-start items-center p-4 bottom-0 absolute ">
          <p>Made with ❤️ by <a href="https://github.com/JinzoTun" target="_blank" className="underline">Jinzo</a> </p>
          <ModeToggle />
    </footer>

  )
}

export default Footer