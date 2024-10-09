<template>
    <div class="__TdeeCalculator">
        <div class="container mx-auto --tdeeContainer">
            <div class="column-1">
                <h1 class="text-2xl font-bold">Calculadora de Consumo Calórico</h1>
            </div>
            <div class="columns-5  my-7">
                <div class="column">
                    <FloatLabel variant="on">
                        <InputNumber inputId="Altura" v-model="height" class="w-full" />
                        <label for="Altura">Altura em cm</label>
                    </FloatLabel>
                </div>
                <div class="column">
                    <FloatLabel variant="on">
                        <InputNumber inputId="Peso" v-model="weight" @update:modelValue="calculateMacros()"
                            class="w-full" />
                        <label for="Peso">Peso em kg</label>
                    </FloatLabel>
                </div>
                <div class="column">
                    <FloatLabel variant="on">
                        <InputNumber inputId="Idade" v-model="age" class="w-full" />
                        <label for="Idade">Idade</label>
                    </FloatLabel>
                </div>
                <div class="column">
                    <FloatLabel variant="on">
                        <InputNumber inputId="gordura" v-model="bodyFatCalc"
                            @update:modelValue="calculateBodyFat($event)" class="w-full" />
                        <label for="gordura">% gordura corporal (opcional)</label>
                    </FloatLabel>
                </div>
                <div class="column">

                    <SelectButton v-model="gender" :options="genderOptions" aria-labelledby="basic" />


                </div>
            </div>
            <div class="columns-1 my-7">
                <div class="column">
                    <div class="my-4">{{ activityLevel }}</div>
                    <Slider v-model="activityLevelSlider" :step="0.01" :min="1.3" :max="2" class="w-full" />
                </div>
            </div>
            <div class="columns-1 my-7">
                <div class="column">
                    <Button label="Calcular" @click="makeTheMagicHappen()" />
                </div>
            </div>
        </div>
        <template v-if="calculated">
            <div class="container mx-auto --tdeeContainer">
                <div class="columns-7 my-7">
                    <div class="column" v-for="(cal, key) in myCalories" :key="key">
                        <div class="--boxCalories border-stone-50 border-solid border p-2"
                            :class="`${objSelected == key ? ' text-green-400' : ''}`" @click="objSelected = key">
                            <label>{{ key }}</label>
                            <div>{{
                                cal
                                }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container mx-auto --tdeeContainer">
                <div class="grid grid-cols-3 gap-3 my-7">
                    <div class="column p-4">
                        <div class="my-4">Gramas de Gordura - {{ grams.fatGrams }} por kg corporal</div>
                        <Slider v-model="grams.fatGrams" :step="0.01" :min="0.1" :max="3" class="w-full" />
                    </div>
                    <div class="column p-4">
                        <div class="my-4">Gramas de Proteínas - {{ grams.proteinGrams }} por kg corporal</div>
                        <Slider v-model="grams.proteinGrams" :step="0.01" :min="0.1" :max="5" class="w-full" />
                    </div>
                    <div class="column p-4">
                        <div class="my-4">Gramas de Carboidratos - {{ grams.carbGrams }} por kg corporal</div>
                        <Slider v-model="grams.carbGrams" :step="0.01" :min="0.1" :max="9" class="w-full" />
                    </div>

                </div>
            </div>
            <div class="container mx-auto --tdeeContainer">
                <div class="grid grid-cols-4 gap-4 my-7">
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
        </template>
    </div>
</template>
<script>
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';

export default {
    name: 'TdeeCalculator',
    data() {
        return {
            height: 0,
            weight: 0,
            age: 0,
            gender: 'Homem',
            genderOptions: ['Homem', 'Mulher'],
            bodyFatCalc: 0,
            bodyFat: 0,
            activityLevel: 'Sedentário (não faz exercícios)',
            activityLevelSlider: 0,
            calculated: false,
            objSelected: '',
            myCalories: {
                'Perda de peso máxima': 0,
                'Perda de peso moderada': 0,
                'Perda de peso leve': 0,
                'Manutenção de peso': 0,
                'Ganho de peso leve': 0,
                'Ganho de peso moderado': 0,
                'Ganho de peso máximo': 0,
            },
            grams: {
                proteinGrams: 2,
                fatGrams: 0.8,
                carbGrams: 3
            },
            caloriesFromGrams: 0,
            proteinGrams: 0,
            fatGrams: 0,
            carbGrams: 0
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

    methods: {
        makeTheMagicHappen() {
            if (this.height === 0 || this.weight === 0 || this.age === 0) {
                return;
            }
            if (this.activityLevelSlider === 0) {
                this.activityLevelSlider = 1.375;
            }
            let calories = this.calculateAllFOrmulas();
            this.myCalories['Perda de peso máxima'] = calories - 1000;
            this.myCalories['Perda de peso moderada'] = calories - 500;
            this.myCalories['Perda de peso leve'] = calories - 250;
            this.myCalories['Manutenção de peso'] = calories;
            this.myCalories['Ganho de peso leve'] = calories + 250;
            this.myCalories['Ganho de peso moderado'] = calories + 500;
            this.myCalories['Ganho de peso máximo'] = calories + 1000;
            this.setObjSelected();
            this.calculated = true;
        },

        calculateAllFOrmulas() {
            if (this.bodyFat === 0) {
                return Math.round((this.calculateTDEEWithHarrisBenedict() + this.calculateTDEEWithMifflinStJeor()) / 2);
            }
            return Math.round((this.calculateTDEEWithKatchMcArdle() + this.calculateTDEEWithCunningham() + this.calculateTDEEWithHarrisBenedict() + this.calculateTDEEWithMifflinStJeor()) / 4);
        },
        harrisBenedictBMR() {
            if (this.gender === 'Homem') {
                return 88.362 + (13.397 * this.weight) + (4.799 * this.height) - (5.677 * this.age);
            } else if (this.gender === 'Mulher') {
                return 447.593 + (9.247 * this.weight) + (3.098 * this.height) - (4.330 * this.age);
            } else {
                throw new Error("Gênero inválido");
            }
        },
        calculateTDEEWithHarrisBenedict() {
            let bmr = this.harrisBenedictBMR();
            bmr = bmr * this.activityLevelSlider;
            console.log('harris', bmr);
            return bmr;
        },
        setActivityLevel(val) {
            val = parseFloat(val);
            if (val < 1.375) {
                return 'Sedentário (não faz exercícios)';
            }
            if (val < 1.55 && val >= 1.375) {
                return 'Treina um pouco (1 a 2 vezes na semana)';
            }
            if (val < 1.6 && val >= 1.55) {
                return 'Treina moderadamente (3 a 5 vezes na semana)';
            }
            if (val < 1.725 && val >= 1.6) {
                return 'Treina bastante (4 a 5 vezes na semana)';
            }
            if (val < 1.9 && val >= 1.725) {
                return 'Treina praticamente todo dia (6 a 7 vezes na semana)';
            }
            if (val >= 1.9) {
                return 'Atleta (treina mais de 1x ao dia, todos os dias)';
            }
            return 'Sedentário (não faz exercícios)';
        },
        mifflinStJeorBMR() {
            let bmr;
            if (this.gender === 'Homem') {
                bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
            } else if (this.gender === 'Mulher') {
                bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
            } else {
                return 'Please enter a valid gender: male or female';
            }
            return bmr;
        },
        calculateTDEEWithMifflinStJeor() {
            let bmr = this.mifflinStJeorBMR();
            bmr = bmr * this.activityLevelSlider;
            console.log('mifflin', bmr);
            return bmr;
        },
        katchMcArdleBMR() {
            const leanBodyMass = this.weight * (1 - this.bodyFat);
            return 370 + (21.6 * leanBodyMass);
        },
        calculateTDEEWithKatchMcArdle() {
            let bmr = this.katchMcArdleBMR(this.weight, this.bodyFat);
            bmr = bmr * this.activityLevelSlider;
            console.log('katch', bmr)
            return bmr
        },
        cunninghamBMR() {
            const leanBodyMass = this.weight * (1 - this.bodyFat);
            const value = 500 + (22 * leanBodyMass);
            return value
        },
        calculateTDEEWithCunningham() {
            let bmr = this.cunninghamBMR();
            bmr = bmr * this.activityLevelSlider;
            console.log('cunningham', bmr)
            return bmr
        },
        calculateBodyFat(event) {
            let percentageValue = event / 100;
            this.bodyFat = percentageValue;
        },
        setObjSelected() {
            for (const key in this.myCalories) {
                if (this.caloriesFromGrams >= this.myCalories[key]
                    && this.caloriesFromGrams <= this.myCalories[key] + 250
                ) {

                    this.objSelected = key;
                }
            }
        },
        calculateMacros() {
            const caloriesFromGrams = {
                protein: 4,
                fat: 9,
                carb: 4
            };
            let caloriesCarbsFromWeight = (this.grams.carbGrams * this.weight) * caloriesFromGrams.carb;
            let caloriesProteinFromWeight = (this.grams.proteinGrams * this.weight) * caloriesFromGrams.protein;
            let caloriesFatFromWeight = (this.grams.fatGrams * this.weight) * caloriesFromGrams.fat;
            this.caloriesFromGrams = Math.round(caloriesCarbsFromWeight + caloriesProteinFromWeight + caloriesFatFromWeight);
            this.carbGrams = Math.round(caloriesCarbsFromWeight / caloriesFromGrams.carb);
            this.proteinGrams = Math.round(caloriesProteinFromWeight / caloriesFromGrams.protein);
            this.fatGrams = Math.round(caloriesFatFromWeight / caloriesFromGrams.fat);
            this.setObjSelected();
            console.log(this.caloriesFromGrams)
        }
    }
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
            cursor: pointer;

            label {
                font-weight: bold;
                font-size: 12px;
            }
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