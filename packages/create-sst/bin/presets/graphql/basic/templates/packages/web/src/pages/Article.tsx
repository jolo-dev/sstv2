import { useTypedQuery } from "@@@app/graphql/urql";
import { useParams } from "react-router-dom";
import Empty from "../components/Empty";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import styles from "./Article.module.css";

export default function Article() {
	const { id = "" } = useParams();

	const [article] = useTypedQuery({
		query: {
			article: {
				__args: {
					articleID: id,
				},
				id: true,
				url: true,
				title: true,
			},
		},
	});

	return (
		<div>
			<Navbar />
			{article.fetching ? (
				<Loading />
			) : article.data?.article ? (
				<div className={styles.article}>
					<h1>{article.data.article.title}</h1>
					<p>
						<a target="_blank" href={article.data.article.url} rel="noreferrer">
							{article.data.article.url}
						</a>
					</p>
				</div>
			) : (
				<Empty>Not Found</Empty>
			)}
		</div>
	);
}
