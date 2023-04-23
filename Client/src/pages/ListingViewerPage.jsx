import { useParams } from "react-router-dom"


export default function ListingViewerPage() {
    const {id} = useParams();
    return(
        <div className="mt-8">
            Listing Page: {id}
        </div>
    )
}