# Topic Block — Machine Learning

FILE:           src/pages/notes/data-science/MachineLearning.jsx
PRIMARY_COLOR:  #8B5CF6
GRAD_START:     #8B5CF6
GRAD_END:       #EC4899
ICON_LETTER:    M
BRAND:          Machine Learning
EDITION:        Scikit-learn · XGBoost · Production ML Reference 2025

COVER:
  title:    "Machine Learning"
  subtitle: "From Theory to Production"
  tagline:  "Mathematical foundations, supervised and unsupervised learning, ensemble methods,
             model evaluation, and MLOps deployment pipelines"
  stats:    6 Parts · 24 Sections · 220+ Concepts

FRESHER ANALOGY:
  Machine learning is teaching a child to recognise dogs from photos. You show them
  thousands of examples (training data). They learn patterns (model). When they see
  a new animal, they predict based on what they learned. The more varied the examples,
  the better they generalise.

CODE LANGUAGES: Python (primary) · scikit-learn · XGBoost · MLflow

---

## Parts & Sections

Part 1 — Mathematical Foundations
  1 — Linear Algebra & Calculus for ML
    1.1 Vectors, Matrices, and Dot Products
    1.2 Eigenvalues and PCA
    1.3 Gradient and Partial Derivatives
    1.4 Chain Rule and Backpropagation Intuition
  2 — Probability & Statistics
    2.1 Probability Distributions in ML
    2.2 Bayes' Theorem Applied
    2.3 Maximum Likelihood Estimation
    2.4 Bias-Variance Trade-off

Part 2 — Supervised Learning
  3 — Linear Models
    3.1 Linear Regression: Closed Form vs Gradient Descent
    3.2 Regularisation: L1 (Lasso), L2 (Ridge), ElasticNet
    3.3 Logistic Regression and Decision Boundary
    3.4 Multiclass: One-vs-Rest, Softmax
  4 — Tree-Based Models
    4.1 Decision Trees: Gini vs Entropy
    4.2 Random Forest: Bagging and Feature Importance
    4.3 Gradient Boosting: XGBoost Deep Dive
    4.4 LightGBM vs CatBoost Comparison

Part 3 — Unsupervised Learning
  5 — Clustering
    5.1 K-Means: Lloyd's Algorithm
    5.2 DBSCAN: Density-Based Clustering
    5.3 Hierarchical Clustering
    5.4 Choosing the Number of Clusters
  6 — Dimensionality Reduction
    6.1 PCA: Variance Explained
    6.2 t-SNE and UMAP for Visualisation
    6.3 Autoencoders

Part 4 — Ensemble Methods & Boosting
  7 — Ensemble Theory
    7.1 Bagging vs Boosting vs Stacking
    7.2 Bias-Variance Decomposition in Ensembles
    7.3 Voting Classifiers
  8 — XGBoost In Depth
    8.1 Boosted Trees: Additive Training
    8.2 Regularisation and Pruning
    8.3 Hyperparameter Tuning Guide
    8.4 GPU Acceleration

Part 5 — Model Evaluation & Tuning
  9 — Evaluation Metrics
    9.1 Classification: Accuracy, Precision, Recall, F1, AUC-ROC
    9.2 Regression: MAE, MSE, RMSE, R²
    9.3 Calibration Curves
    9.4 Imbalanced Data: SMOTE and Class Weights
  10 — Hyperparameter Optimisation
    10.1 Grid Search vs Random Search vs Bayesian
    10.2 Optuna Framework
    10.3 Cross-Validation Strategies
    10.4 Feature Selection Techniques

Part 6 — MLOps & Production Deployment
  11 — MLflow for Experiment Tracking
    11.1 Tracking Runs, Parameters, Metrics
    11.2 Model Registry and Staging Workflow
    11.3 MLflow Projects and Deployment
  12 — Serving ML Models
    12.1 REST API with FastAPI + Model Loading
    12.2 Batch Inference Pipelines
    12.3 Online Feature Stores
    12.4 Model Drift Detection and Monitoring

---

## Required Diagrams

1. Part 1 — Bias-Variance Trade-off (Flat SVG): U-curve showing underfitting to overfitting
2. Part 2 — Decision Tree Split (Flat SVG): node with Gini calculation, child splits
3. Part 4 — Boosting Iterations (Flat SVG): sequential trees adding residuals
4. Part 5 — Confusion Matrix (Flat SVG): 2x2 grid with TP, FP, FN, TN labelled
5. Part 5 — ROC Curve (Flat SVG): multiple model curves with AUC shaded
6. Part 6 — MLOps Pipeline (3D IsoBox): Data → Train → Evaluate → Registry → Serve → Monitor
