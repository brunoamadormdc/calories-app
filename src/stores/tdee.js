export default {
    state: () => ({
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
    }),
    getters: {
        getHeight: (state) => state.height,
        getWeight: (state) => state.weight,
        getAge: (state) => state.age,
        getGender: (state) => state.gender,
        getBodyFatCalc: (state) => state.bodyFatCalc,
        getBodyFat: (state) => state.bodyFat,
        getActivityLevel: (state) => state.activityLevel,
        getActivityLevelSlider: (state) => state.activityLevelSlider,
        getCalculated: (state) => state.calculated,
        getObjSelected: (state) => state.objSelected,
        getMyCalories: (state) => state.myCalories,
        getGrams: (state) => state.grams,
        getCaloriesFromGrams: (state) => state.caloriesFromGrams,
        getProteinGrams: (state) => state.proteinGrams,
        getFatGrams: (state) => state.fatGrams,
        getCarbGrams: (state) => state.carbGrams,
        getGenderOptions: (state) => state.genderOptions,

    },
    actions: {
        makeTheMagicHappen() {

            if (this.height === 0 || this.weight === 0 || this.age === 0) {
                return;
            }
            if (this.activityLevelSlider === 0) {
                this.activityLevelSlider = 1.375;
            }
            if (this.activityLevelSlider >= 1.875) {
                this.activityLevelSlider = 1.91;
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
            if (this.bodyFat === 0
                || this.bodyFat === null
            ) {
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
            if (val < 1.475 && val >= 1.375) {
                return 'Treina 1x na semana';
            }
            if (val < 1.575 && val >= 1.475) {
                return 'Treina de 2 a 3x na semana';
            }
            if (val < 1.675 && val >= 1.575) {
                return 'Treina de 4 a 5x na semana';
            }
            if (val < 1.775 && val >= 1.675) {
                return 'Treina 5 a 6x na semana';
            }
            if (val < 1.875 && val >= 1.775) {
                return 'Treina 7x na semana';
            }
            if (val >= 1.875) {
                return 'Treina 7x na semana mais de 1x ao dia';
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
        }
    },
    persist: true

}