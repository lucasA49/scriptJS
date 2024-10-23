import { exec } from 'child_process';

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`Erreur : ${stderr}`);
        reject(error);
      }
      resolve(stdout);
    });
  });
};

const createOrSwitchToDevBranch = async () => {
  try {
    console.log('Création de la branche dev ou basculement...');
    await runCommand('git checkout -b dev || git checkout dev');
  } catch (error) {
    console.error('Erreur lors de la création ou du basculement sur dev:', error);
    process.exit(1);
  }
};

// Pousser les modifications 
const pushToDev = async () => {
  try {
    console.log('Pushing sur dev...');
    await runCommand('git add .');
    await runCommand('git commit -m "Commit des changements pour tests"');
    await runCommand('git push origin dev');
  } catch (error) {
    console.error('Erreur lors du push vers dev:', error);
    process.exit(1);
  }
};

// Lance  les tests
const runTests = async () => {
  try {
    console.log('Exécution des tests...');
    await runCommand('npm test'); 
    console.log('Tous les tests sont passés avec succès.');
  } catch (error) {
    console.error('Les tests ont échoué. Le merge ne sera pas effectué.');
    process.exit(1); 
  }
};

// Merge les branche et push
const mergeToMain = async () => {
  try {
    console.log('Basculement sur main...');
    await runCommand('git checkout main');

    console.log('Fusion de dev dans main...');
    await runCommand('git merge dev');

    console.log('Pushing sur main...');
    await runCommand('git push origin main');
    console.log('La fusion et le push vers main ont été effectués avec succès.');
  } catch (error) {
    console.error('Erreur lors de la fusion ou du push vers main:', error);
    process.exit(1);
  }
};

const main = async () => {
  await createOrSwitchToDevBranch(); 
  await pushToDev();  
  await runTests();  
  await mergeToMain();  
};

main();
