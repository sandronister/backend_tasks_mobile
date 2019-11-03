const moment = require('moment');

module.exports = (app) => {
	const getTasks = (req, res) => {
		const date = req.query.date ? req.query.date : moment().endOf('day').toDate();

		app
			.db('tasks')
			.where({ userId: req.user.id })
			.where('estimateAt', '<=', date)
			.orderBy('estimateAt')
			.then((tasks) => res.json(tasks))
			.catch((err) => res.status(400).json(err));
	};

	const save = (req, res) => {
		if (!req.body.desc) {
			return res.status(400).send({ message: 'Obrigatório informar descrição' });
		}

		req.body.userId = req.user.id;

		app.db('tasks').insert(req.body).then((_) => res.sendStatus(201)).catch((err) => res.status(400).send(err));
	};

	const remove = (req, res) => {
		app
			.db('tasks')
			.where({ id: req.params.id, user: req.user.id })
			.del()
			.then((rowsDelete) => {
				if (rowsDelete > 0) {
					return res.sendStatus(204);
				}

				return res.status(400).send({ message: `Não foi encontrado a tarefa ${req.params.id}` });
			})
			.catch((err) => res.status(400).send(err));
	};

	const updateTaskDoneAt = (req, res, doneAt) => {
		app
			.db('tasks')
			.where({ id: req.params.id, user: req.user.id })
			.update(doneAt)
			.then((_) => res.status(204))
			.catch((err) => res.status(400).send(err));
	};

	const toggleTasks = (req, res) => {
		app
			.db('tasks')
			.where({ id: req.params.id, user: req.user.id })
			.first()
			.then((task) => {
				if (!task) {
					return res.status(400).send({ message: `Não foi encontrado a tarefa ${req.params.id}` });
				}

				const doneAt = task.doneAt ? null : new Date();
				updateTaskDoneAt(req, res, doneAt);
			})
			.catch((err) => res.status(400).send(err));
	};

	return { getTasks, save, remove, toggleTasks };
};
