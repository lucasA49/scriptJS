import { exec } from 'child_process';

// Fonction pour exécuter une commande shell
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

// Créer ou basculer sur la branche de développement
const createOrSwitchToDevBranch = async () => {
  try {
    console.log('Création de la branche dev ou basculement...');
    await runCommand('git checkout -b dev || git checkout dev');
  } catch (error) {
    console.error('Erreur lors de la création ou du basculement sur dev:', error);
    process.exit(1);
  }
};

// Pousser les modifications sur dev
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

// Exécuter les tests
const runTests = async () => {
  try {
    console.log('Exécution des tests...');
    await runCommand('npm test');  // Exécute les tests configurés dans ton projet
    console.log('Tous les tests sont passés avec succès.');
  } catch (error) {
    console.error('Les tests ont échoué. Le merge ne sera pas effectué.');
    process.exit(1);  // Arrête le script si les tests échouent
  }
};

// Fusionner la branche dev dans main et pusher sur main
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

// Fonction principale pour orchestrer tout le processus
const main = async () => {
  await createOrSwitchToDevBranch();  // Créer ou switcher vers dev
  await pushToDev();  // Pousser les modifications sur dev
  await runTests();  // Exécuter les tests
  await mergeToMain();  // Si les tests réussissent, merge vers main
};

// Lancer le script
main();
