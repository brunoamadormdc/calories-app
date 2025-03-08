<template>
    <div class="__TdeeCalculator">
        <div class="container mx-auto --tdeeContainer">
            <div class="column-1">
                <h1 class="text-2xl font-bold p-5">Calculadora de Consumo Calórico (TDEE)</h1>
            </div>
            <div class="lg:columns-5 max-[450px]:columns-1 max-[1400px]:columns-1 md:columns-1  lg:my-7">
                <div class="column ">
                    <FloatLabel variant="on">
                        <InputNumber inputId="Altura" v-model="height" class="w-full" />

                        <label for="Altura">Altura em cm</label>
                    </FloatLabel>
                </div>
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5 sm:my-3.5 md:my-3.5">
                    <FloatLabel variant="on">
                        <InputNumber inputId="Peso" v-model="weight" @update:modelValue="calculateMacros()"
                            class="w-full" />
                        <label for="Peso">Peso em kg</label>
                    </FloatLabel>
                </div>
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5 sm:my-3.5 md:my-3.5">
                    <FloatLabel variant="on">
                        <InputNumber inputId="Idade" v-model="age" class="w-full" />
                        <label for="Idade">Idade</label>
                    </FloatLabel>
                </div>
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5 sm:my-3.5 md:my-3.5">
                    <FloatLabel variant="on">
                        <InputNumber inputId="gordura" v-model="bodyFatCalc"
                            @update:modelValue="calculateBodyFat($event)" class="w-full" />
                        <label for="gordura">% gordura corporal (opcional)</label>
                    </FloatLabel>
                </div>
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5 sm:my-3.5 md:my-3.5">

                    <SelectButton v-model="gender" :options="genderOptions" aria-labelledby="basic" />


                </div>
            </div>
            <div class="md:columns-1 max-[450px]:columns-1 max-[1400px]:columns-1 my-7">
                <div class="column">
                    <div class="my-4">{{ activityLevel }}</div>
                    <Slider v-model="activityLevelSlider" :step="0.1" :min="1.275" :max="1.876" class="w-full" />
                </div>
            </div>
            <div class="md:columns-1 max-[450px]:columns-1 max-[1400px]:columns-1 my-7">
                <div class="column">
                    <Button label="Calcular" @click="makeTheMagicHappen()" />
                </div>
            </div>
        </div>

        <div class="container mx-auto --tdeeContainer">
            <div class="max-[450px]:columns-1 max-[1400px]:columns-1 sm:columns-1 md:columns-3 lg:columns-7">
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5" v-for="(cal, key) in myCalories" :key="key">
                    <div class="--boxCalories border-stone-50 border-solid border p-2"
                        :class="`${objSelected == key ? ' text-green-400 --selectedOption' : ''}`">
                        <label>{{ key }}</label>
                        <div>{{
                            cal
                        }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container mx-auto --tdeeContainer">
            <div
                class="grid grid-cols-3 max-[450px]:grid-cols-1 max-[1400px]:grid-cols-1 sm:grid-cols-1 md:grid-cols-3  gap-3 my-7">
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5  p-4">
                    <div class="my-4">Gramas de Gordura - {{ grams.fatGrams }} por kg corporal</div>
                    <Slider v-model="grams.fatGrams" :step="0.01" :min="0.1" :max="3" class="w-full" />
                </div>
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5  p-4">
                    <div class="my-4">Gramas de Proteínas - {{ grams.proteinGrams }} por kg corporal</div>
                    <Slider v-model="grams.proteinGrams" :step="0.01" :min="0.1" :max="5" class="w-full" />
                </div>
                <div class="column max-[450px]:my-3.5 max-[1400px]:my-3.5 p-4">
                    <div class="my-4">Gramas de Carboidratos - {{ grams.carbGrams }} por kg corporal</div>
                    <Slider v-model="grams.carbGrams" :step="0.01" :min="0.1" :max="9" class="w-full" />
                </div>

            </div>
        </div>
        <div class="container mx-auto --tdeeContainer">
            <div class="grid grid-cols-4 max-[450px]:grid-cols-1 max-[1400px]:grid-cols-1 gap-4 my-7">
                <div class="column  --bxCalories">
                    <div>Carboidratos</div>
                    {{ carbGrams }}
                </div>
                <div class="column  --bxCalories">
                    <div>Gordura</div>
                    {{ fatGrams }}
                </div>
                <div class="column  --bxCalories">
                    <div>Proteínas</div>
                    {{ proteinGrams }}
                </div>
                <div class="column  --bxCalories">
                    <div>Calorias</div>
                    {{ caloriesFromGrams }}
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { useTdeeStore } from '@/stores';
import { storeToRefs } from 'pinia';


export default {
    name: 'TdeeCalculator',
    setup() {
        const store = useTdeeStore();
        const { height, weight, age, gender, bodyFatCalc, bodyFat, activityLevel, activityLevelSlider, calculated, objSelected, myCalories, grams, caloriesFromGrams, proteinGrams, fatGrams, carbGrams, genderOptions } = storeToRefs(store);
        const makeTheMagicHappen = store.makeTheMagicHappen;
        const calculateAllFormulas = store.calculateAllFOrmulas;
        const setActivityLevel = store.setActivityLevel;
        const setObjSelected = store.setObjSelected;
        const calculateMacros = store.calculateMacros;
        const harrisBenedictBMR = store.harrisBenedictBMR;
        const calculateTDEEWithHarrisBenedict = store.calculateTDEEWithHarrisBenedict;
        const mifflinStJeorBMR = store.mifflinStJeorBMR;
        const calculateTDEEWithMifflinStJeor = store.calculateTDEEWithMifflinStJeor;
        const katchMcArdleBMR = store.katchMcArdleBMR;
        const calculateTDEEWithKatchMcArdle = store.calculateTDEEWithKatchMcArdle;
        const cunninghamBMR = store.cunninghamBMR;
        const calculateTDEEWithCunningham = store.calculateTDEEWithCunningham;
        const calculateBodyFat = store.calculateBodyFat;


        return {
            makeTheMagicHappen,
            calculateAllFormulas,
            setActivityLevel,
            setObjSelected,
            calculateMacros,
            harrisBenedictBMR,
            calculateTDEEWithHarrisBenedict,
            mifflinStJeorBMR,
            calculateTDEEWithMifflinStJeor,
            katchMcArdleBMR,
            calculateTDEEWithKatchMcArdle,
            cunninghamBMR,
            calculateTDEEWithCunningham,
            calculateBodyFat,
            height,
            weight,
            age,
            gender,
            bodyFatCalc,
            bodyFat,
            activityLevel,
            activityLevelSlider,
            calculated,
            objSelected,
            myCalories,
            grams,
            caloriesFromGrams,
            proteinGrams,
            fatGrams,
            carbGrams,
            genderOptions
        }
    },

    components: {
        /*  InputText, */
        Slider,
        FloatLabel,
        InputNumber,
        Button,
        SelectButton
    },
    watch: {
        activityLevelSlider(val) {
            this.activityLevel = this.setActivityLevel(val);
        },
        grams: {
            handler() {

                this.calculateMacros()

            },
            deep: true
        },

    },

}
</script>
<style lang="scss" scoped>
.__TdeeCalculator {
    .--tdeeContainer {
        padding: 1rem;

        .--boxCalories {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 5px;


            label {
                font-weight: bold;
                font-size: 12px;
            }
        }

        .--selectedOption {
            background-color: #34d399;
            color: #fff;
        }

        .--bxCalories {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            cursor: pointer;
            padding: 20px;
            font-weight: bold;
            background-color: #34d399;

            border: 1px solid #fff;
        }
    }
}
</style>