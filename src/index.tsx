/* @refresh reload */
import { render } from "solid-js/web"

import { AppComp } from "./comp/AppComp"
import "./css/screen.css"

const root = document.getElementById("root")

render(() => <AppComp />, root!)
