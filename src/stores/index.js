import { defineStore } from "pinia";
import tdee from "./tdee";

export const useTdeeStore = defineStore("tdeeStore", tdee);